# HEAP2025
kiasuplanner!




Backend FastAPI Setup
1. Create ec2 machine on aws.
2. sudo yum update -y
3. sudo yum install -y docker
4. sudo systemctl start docker
5. sudo systemctl enable docker
6. sudo usermod -aG docker ec2-user
7. sudo docker pull wzinl/kiasuplannerbackend
8. sudo docker run -p 80:8000 wzinl/kiasuplannerbackend