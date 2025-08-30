import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { renderGraphiQL } from "graphql-helix";

async function explorerHandler(
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
    },
    body: renderGraphiQL(),
  };
}

export default explorerHandler;