import path from 'path';
import * as agw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

class SimpleHttpLambdaTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'TestFunction', {
      code: lambda.AssetCode.fromAsset(path.join(__dirname, '../dist')),
      handler: 'lambda.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const api = new agw.LambdaRestApi(this, 'TestApi', {
      handler,
      proxy: true,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });
  }
}

const app = new cdk.App();
new SimpleHttpLambdaTestStack(app, 'SimpleHttpLambdaTestStack');
