import path from 'path';
import * as agw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';

const codeSource = {
  base: path.resolve(__dirname, '../dist'),
  handler: 'lambda.handler',
};

class SimpleHttpLambdaTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let code = {
      code: lambda.AssetCode.fromAsset(codeSource.base),
      handler: codeSource.handler,
    };

    if (process.env.DEBUG_LAMBDA) {
      const baseDir = path.resolve(__dirname, '../../../');

      code = {
        code: lambda.AssetCode.fromAsset(baseDir),
        handler: path.relative(
          baseDir,
          path.join(codeSource.base, codeSource.handler),
        ),
      };
    }

    const handler = new lambda.Function(this, 'TestFunction', {
      ...code,
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const api = new agw.LambdaRestApi(this, 'TestApi', {
      handler,
      proxy: true,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });

    const webSocketHandlerRole = new iam.Role(this, 'WebSocketHandlerRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
      ],
    });

    const webSocketHandler = new lambda.Function(
      this,
      'WebSocketHandlerFunction',
      {
        code: lambda.AssetCode.fromAsset(codeSource.base),
        handler: 'lambda.socketHandler',
        runtime: lambda.Runtime.NODEJS_10_X,
        role: webSocketHandlerRole,
      },
    );

    const wsApi = new cdk.CfnResource(this, 'WsTestApi', {
      type: 'AWS::ApiGatewayV2::Api',
      properties: {
        Name: 'WsTestApi',
        ProtocolType: 'WEBSOCKET',
        RouteSelectionExpression: '$request.body.apigwroute',
      },
    });

    const wsApiIntegration = new cdk.CfnResource(this, 'WsTestApiIntegration', {
      type: 'AWS::ApiGatewayV2::Integration',
      properties: {
        ApiId: wsApi.ref,
        IntegrationType: 'AWS_PROXY',
        IntegrationUri: Stack.of(this).formatArn({
          service: 'apigateway',
          account: 'lambda',
          resource: 'path',
          sep: '/',
          resourceName: `2015-03-31/functions/${webSocketHandler.functionArn}/invocations`,
        }),
      },
    });

    const wsApiConnectRoute = new cdk.CfnResource(
      this,
      'WsTestApiConnectRoute',
      {
        type: 'AWS::ApiGatewayV2::Route',
        properties: {
          ApiId: wsApi.ref,
          OperationName: 'ConnectRoute',
          RouteKey: '$connect',
          RouteResponseSelectionExpression: '$default',
          Target: `integrations/${wsApiIntegration.ref}`,
        },
      },
    );
    const wsApiConnectRouteResponse = new cdk.CfnResource(
      this,
      'WsTestApiConnectRouteResponse',
      {
        type: 'AWS::ApiGatewayV2::RouteResponse',
        properties: {
          ApiId: wsApi.ref,
          RouteId: wsApiConnectRoute.ref,
          RouteResponseKey: '$default',
        },
      },
    );

    const wsApiDisconnectRoute = new cdk.CfnResource(
      this,
      'WsTestApiDisconnectRoute',
      {
        type: 'AWS::ApiGatewayV2::Route',
        properties: {
          ApiId: wsApi.ref,
          OperationName: 'DisconnectRoute',
          RouteKey: '$disconnect',
          RouteResponseSelectionExpression: '$default',
          Target: `integrations/${wsApiIntegration.ref}`,
        },
      },
    );
    const wsApiDisconnectRouteResponse = new cdk.CfnResource(
      this,
      'WsTestApiDisconnectRouteResponse',
      {
        type: 'AWS::ApiGatewayV2::RouteResponse',
        properties: {
          ApiId: wsApi.ref,
          RouteId: wsApiDisconnectRoute.ref,
          RouteResponseKey: '$default',
        },
      },
    );

    const wsApiDefaultRoute = new cdk.CfnResource(
      this,
      'WsTestApiDefaultRoute',
      {
        type: 'AWS::ApiGatewayV2::Route',
        properties: {
          ApiId: wsApi.ref,
          OperationName: 'DefaultRoute',
          RouteKey: '$default',
          RouteResponseSelectionExpression: '$default',
          Target: `integrations/${wsApiIntegration.ref}`,
        },
      },
    );
    const wsApiDefaultRouteResponse = new cdk.CfnResource(
      this,
      'WsTestApiDefaultRouteResponse',
      {
        type: 'AWS::ApiGatewayV2::RouteResponse',
        properties: {
          ApiId: wsApi.ref,
          RouteId: wsApiDefaultRoute.ref,
          RouteResponseKey: '$default',
        },
      },
    );

    const wsApiDeployment = new cdk.CfnResource(this, 'WsTestApiDeployment', {
      type: 'AWS::ApiGatewayV2::Deployment',
      properties: {
        ApiId: wsApi.ref,
      },
    });

    wsApiDeployment.addDependsOn(wsApiConnectRoute);
    wsApiDeployment.addDependsOn(wsApiDisconnectRoute);
    wsApiDeployment.addDependsOn(wsApiDefaultRoute);
    wsApiDeployment.addDependsOn(wsApiConnectRouteResponse);
    wsApiDeployment.addDependsOn(wsApiDisconnectRouteResponse);
    wsApiDeployment.addDependsOn(wsApiDefaultRouteResponse);

    const wsApiStage = new cdk.CfnResource(this, 'WsTestApiStage', {
      type: 'AWS::ApiGatewayV2::Stage',
      properties: {
        ApiId: wsApi.ref,
        StageName: 'prod',
        DeploymentId: wsApiDeployment.ref,
      },
    });

    const wsApiStageArn = Stack.of(this).formatArn({
      service: 'execute-api',
      resource: wsApi.ref,
      sep: '/',
      resourceName: `${wsApiStage.ref}/*`,
    });

    const principal = new iam.ServicePrincipal('apigateway.amazonaws.com');
    webSocketHandler.addPermission(`ApiPermission.${wsApi.node.uniqueId}`, {
      principal,
      scope: wsApiIntegration,
      sourceArn: wsApiStageArn,
    });

    new iam.Policy(this, 'WebSockerHandlerSendPermission', {
      roles: [webSocketHandlerRole],
      statements: [
        new iam.PolicyStatement({
          actions: ['execute-api:ManageConnections'],
          resources: [wsApiStageArn],
        }),
      ],
    });

    new cdk.CfnOutput(this, 'WsTestApiUri', {
      value: `wss://${wsApi.ref}.execute-api.${
        Stack.of(this).region
      }.amazonaws.com/${wsApiStage.ref}`,
    });
  }
}

const app = new cdk.App();
new SimpleHttpLambdaTestStack(app, 'SimpleHttpLambdaTestStack');
