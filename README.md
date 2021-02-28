# istio-auth-filter

## Introduction

Here you will run now to run Istio on Kubernetes. There is one protected service which has `/protected` endpoint. This endpoint is unaware of the authentication logic and the authn and authz logic is moved to the _simple=node-auth_ service in the repo.

The _simple-node-auth_ service exposes `/auth` endpoint which is used to authenticate and authorized the request. If the request is successful it will add the `org-name` in the response header. This header is added to the request we make after to the protected service.

## Steps

Before working apply the steps make sure that Istio is installed on the Kubernetes cluster. We are mostly following the steps which is mentioned in the [istio custom authorizer](https://istio.io/latest/docs/tasks/security/authorization/authz-custom/).

Apply the yaml files in order as they are mentioned in their name. Node the demo assumes that you have using `develop` namespace.

```sh
kubectl apply -f 01-deploy-protected.yaml -n develop

kubectl apply -f 02-sleep-service.yml -n develop

kubectl exec "$(kubectl get pod -l app=sleep -n develop -o jsonpath={.items..metadata.name})" -c sleep -n develop -- curl -X POST http://simple-node-protected:8000/protected

# After this follow the steps needed to change istio configmap

kubectl apply -f 04-ext-authz.yaml -n develop

kubectl apply -f 05-authz-policy.yaml -n develop
```

To check if everything works you need to run the command below

```sh
kubectl exec "$(kubectl get pod -l app=sleep -n develop -o jsonpath={.items..metadata.name})" -c sleep -n develop -- curl -X POST 'http://simple-node-protected:8000/protected' --header 'x-api-key: this is a super secret key'

# {"msg":"protected resource available"}
```

### Applying Gateway

You can apply gateway by running the following command. It will create istio gateway as well as the virtual service.

```sh
kubectl apply -f 06-ingress-gateway.yaml -n develop
```

After it's done you can access it on `http://$INGRESS_HOST:$INGRESS_PORT/protected`. But wait, from where can we get this value?

```sh
export INGRESS_PORT=$(kubectl -n istio-system get service istio-ingressgateway -o jsonpath='{.spec.ports[?(@.name=="http2")].nodePort}')
#      ^ this will give you the PORT
export INGRESS_HOST=$(minikube ip)
#      ^ this will give you the host
```

Read [ingress-gateway](https://istio.io/latest/docs/tasks/traffic-management/ingress/ingress-control/) for more info.
