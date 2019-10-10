import * as agw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { source } from '@fmtk/simple-http-lambda/lib/testLambda';

class SimpleHttpLambdaTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'TestFunction', {
      code: lambda.AssetCode.fromAsset(source.module),
      handler: source.file.replace(/\.js$/, '.testLambda'),
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
