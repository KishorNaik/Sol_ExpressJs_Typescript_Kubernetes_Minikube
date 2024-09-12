# Step by Step guide to deploy expressJs in Kubernetes with minikube

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Docker Desktop**: This is essential for building and managing Docker containers. You can download and install it from Docker's official website.
2. **Minikube**: Minikube is a tool that lets you run Kubernetes locally. You can install it by following the instructions on the Minikube documentation page.

### Install minikube from the following link.

https://minikube.sigs.k8s.io/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download

## Step 1:Run Minikube

To start your Kubernetes cluster using Minikube, open your terminal or command prompt and execute the following command:

```powershell
minikube start
```

This command initializes a single-node Kubernetes cluster on your local machine.

## Step 2: Configure Dockerfile

Create a Dockerfile in your project directory. This file contains instructions on how to build your Docker image. Below is an example Dockerfile for a Node.js application

```Dockerfile
# NodeJS Version 16
FROM node:18.20.4-bullseye-slim

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /app

# Install Node Package
RUN npm install --legacy-peer-deps

# Set Env
#ENV NODE_ENV development

EXPOSE 3000

# Cmd script
CMD ["npm", "run", "start"]
```

This Dockerfile uses a specific Node.js version, copies your application code into the container, installs dependencies, and sets the command to start your application.

## Step 3: Set the docker environment for Minikube.

To use the Docker daemon inside Minikube, you need to configure your shell to use Minikube’s Docker environment. Run the following command in PowerShell:

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

This command sets up your environment to use the Docker daemon inside the Minikube VM.
Note: If you have entered the above command in the terminal then you have to run the following command in the same terminal to use the Docker environment. Do not change the terminal.

## Step 4: Build Docker Image

Build your Docker image using the Dockerfile you created. Run the following command in your terminal:

```powershell
docker build -t my-node-app:latest .
```

This command builds a Docker image named my-node-app with the latest tag.

## Step 5: Create deployment.yaml file in root directory

Create a deployment.yaml file in your project’s root directory. This file defines the Kubernetes deployment for your application. Below is an example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
    name: my-node-app
spec:
    replicas: 2
    selector:
        matchLabels:
            app: my-node-app
    template:
        metadata:
            labels:
                app: my-node-app
        spec:
            containers:
                - name: my-node-app
                  image: my-node-app:latest
                  imagePullPolicy: IfNotPresent
                  ports:
                      - containerPort: 3000
                  env:
                      - name: PORT
                        value: '3000'
```

This YAML file specifies a deployment with two replicas of your application, using the Docker image you built.

## Step 6: Create service.yaml file in root directory

Create a service.yaml file in your project’s root directory. This file defines the Kubernetes service that exposes your application. Below is an example:

```yaml
apiVersion: v1
kind: Service
metadata:
    name: my-node-app-service
spec:
    type: NodePort
    selector:
        app: my-node-app
    ports:
        - protocol: TCP
          port: 3000
          targetPort: 3000
          nodePort: 30001
```

This YAML file creates a service of type NodePort that maps port 3000 of your application to port 30001 on the host.

## Step 7: Create a namespace in minikube

Namespaces in Kubernetes provide a way to divide cluster resources between multiple users. Create a namespace for your application by running the following command:

```powershell
kubectl create namespace myapp
```

To verify the namespace creation, you can list all namespaces:

```powershell
kubectl get namespace
```

## Step 8: Deploy Application in Minikube

Deploy your application using the deployment.yaml file you created. Run the following command:

```powershell
kubectl apply -n myapp -f deployment.yaml
```

This command applies the deployment configuration in the myapp namespace.

To view the deployment status, use:

```powershell
kubectl get -n myapp deployment
```

If you need to delete the deployment, run:

```powershell
kubectl delete -n myapp deployment my-node-app
```

## Step 9: Create service in minikube

Create the service using the service.yaml file. Run the following command:

```powershell
kubectl apply -n myapp -f service.yaml
```

This command applies the service configuration in the myapp namespace.

To view the service status, use:

```powershell
kubectl get -n myapp service
```

If you need to delete the service, run:

```powershell
kubectl delete -n myapp service my-node-app-service
```

## Step 10: View and Manage Pods

To view the pods in your namespace, use:

```powershell
kubectl get pod -n myapp
```

To get detailed information about a specific pod, use:

```powershell
kubectl describe pod -n myapp my-node-app
```

To view the logs of a specific pod, use:

```powershell
kubectl logs <pod-name> -n myapp
```

To delete a specific pod, use

```powershell
kubectl delete -n myapp pod my-node-app
```

Or to delete all pods in the namespace, use:

```powershell
kubectl delete pods --all -n myapp
```

To verify pod connectivity, you can execute a command inside a pod:

```powershell
kubectl exec -it <pod-name> -n myapp -- /bin/sh
```

## Step 11: Port Forward to Local Machine

To test your application outside of Minikube, you can port forward the service to your local machine:

```powershell
kubectl port-forward -n myapp svc/my-node-app-service 30001:3000
```

This command forwards port 30001 on your local machine to port 3000 on the service, allowing you to access your application via http://localhost:30001.

## Step 12: Clean up

### Kubernetes Cleanup

After you have finished testing and no longer need the resources, you can clean up your Kubernetes environment to free up resources.

To delete a specific pod:

```powershell
kubectl delete -n myapp pod my-node-app
```

Or to delete all pods in the namespace:

```powershell
kubectl delete pods --all -n myapp
```

To delete the service:

```powershell
kubectl delete -n myapp service my-node-app-service
```

To delete the deployment:

```powershell
kubectl delete -n myapp deployment my-node-app
```

To delete the namespace:

```powershell
kubectl delete namespace myapp
```

### Docker Cleanup

Clean up Docker images, containers, volumes, and networks to free up disk space.

```powershell
docker rmi my-node-app:latest
docker image prune -f
docker image prune -a -f
docker container prune -f
docker volume prune -f
docker network prune -f
```

### Minikube Cleanup

Stop and delete the Minikube cluster to free up resources.
To stop the Minikube cluster:

```powershell
minikube stop
```

To delete the Minikube cluster:

```powershell
minikube delete
```
