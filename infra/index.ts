import * as pulumi from '@pulumi/pulumi';
import * as gcp from '@pulumi/gcp';
import * as docker from '@pulumi/docker';

const PORT = 3000;
const IMAGE_NAME = 'pulumi-app';
const REVISION = 11;
const SERVICE_NAME = 'pulumi-app';

const image = new docker.Image(IMAGE_NAME, {
  imageName: pulumi.interpolate`gcr.io/${gcp.config.project}/${IMAGE_NAME}:${REVISION}`,
  build: {
    context: '../app',
    platform: 'linux/amd64',
  },
});

const service = new gcp.cloudrun.Service(SERVICE_NAME, {
  name: SERVICE_NAME,
  location: 'us-central1',
  template: {
    metadata: {
      name: `${SERVICE_NAME}-revision-${REVISION}`,
    },
    spec: {
      containers: [
        {
          image: image.imageName,
          ports: [
            {
              containerPort: PORT,
            },
          ],
          startupProbe: {
            httpGet: {
              path: '/healthz',
              port: PORT,
            },
            initialDelaySeconds: 240,
          },
        },
      ],
    },
  },
});

// DON'T NEED TO CARE
// allow all users to access
const noauthIAMPolicy = gcp.organizations.getIAMPolicy({
  bindings: [
    {
      role: 'roles/run.invoker',
      members: ['allUsers'],
    },
  ],
});

new gcp.cloudrun.IamPolicy('noauthIamPolicy', {
  location: service.location,
  project: service.project,
  service: service.name,
  policyData: noauthIAMPolicy.then(
    (noauthIAMPolicy) => noauthIAMPolicy.policyData,
  ),
});

export const imageName = image.imageName;
