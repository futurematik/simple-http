import path from 'path';
import * as agw from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

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
  }
}

const app = new cdk.App();
new SimpleHttpLambdaTestStack(app, 'SimpleHttpLambdaTestStack');
