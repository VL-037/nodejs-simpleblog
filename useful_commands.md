## Updating Image Used By a Deployment

- the deployment must be using the 'latest' tag in the pod spec section
- make an update to your code
- build the image
- push the image to docker hub `docker push [image_name]`
- run the command `kubectl rollout restart deployment [depl_name]`