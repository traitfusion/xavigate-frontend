// AWS Amplify configuration
// Using `any` here to allow passing a ResourcesConfig-like object directly into Amplify.configure
export const awsConfig: any = {
  Auth: {
    // Cognito user pools configuration
    Cognito: {
      // AWS region for Cognito
      region: "us-east-1",
      // ID of the Cognito User Pool
      userPoolId: "us-east-1_csH9tZFJF",
      // App client ID for the User Pool
      userPoolClientId: "56352i5933v40t36u1fqs2fe3e",
      // Require users to be signed in
      mandatorySignIn: true,
      // Optional: customize sign-in mechanisms
      // loginWith: { username: true, email: false, phone: false },
    },
  },
};
