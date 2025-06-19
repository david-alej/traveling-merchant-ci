CLUSTER_NAME=dev-cluster

# Delete via k3d
k3d cluster delete $CLUSTER_NAME

# Cleanup Docker containers
docker ps -a --filter "name=k3d-$CLUSTER_NAME" --format "{{.ID}}" | xargs -r docker rm -f

# Cleanup Docker volumes
docker volume ls --filter "name=k3d-$CLUSTER_NAME" --format "{{.Name}}" | xargs -r docker volume rm

# Cleanup Docker network
docker network ls --filter "name=k3d-$CLUSTER_NAME" --format "{{.Name}}" | xargs -r docker network rm
