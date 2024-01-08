# Quick Start Guide

## Requirements
- Docker Desktop
- Git
- VS Code
- Node.js

## Steps
1. **Download and Install Required Software:**
    - [Docker Desktop](https://www.docker.com/products/docker-desktop)
        - After installation, you may encounter a "Docker failed to initialize" error. Use a terminal to kill the Docker process and restart.
        - You need to install WSL. Use CMD or Windows PowerShell to run:
        ```
        wsl --update
        ```
    - [Git](https://git-scm.com/)
    - [VS Code](https://code.visualstudio.com/)
    - [Node.js](https://nodejs.org/)

2. **Clone the Repository:**
    ```
    git clone <repository_url>
    ```
    Make sure to replace `<repository_url>` with the actual URL of the repository.

3. **Build and Run the Docker Environment:**
    Navigate to the root folder of the project where the "docker-compose.eaxmple.yaml" file is located and create a copy named "docker-compose.yaml". Change the default configuration if needed. In the same locationa as the "docker-compose.yaml" use the terminal and  run:
    ```
    docker-compose up --build
    ```
     If you experience errors, for example hinting to "Not enough memory", check the README.md step 7

4. **Access the Environment:**
    After the environment has started, access it through your web browser using the following URL:
    ```
    localhost
    ```
    If it's not running on the default port, use the port specified, e.g., `localhost:80`.

5. **Make Custom Commands:**
    To simplify certain operations, you can use the custom `make` command. Add the following function to your bash profile or bashrc file:
    ```
    code ~/.bashrc
    ```
    and add

    ```bash
    function make() {
        case $1 in
            "up")
                docker-compose up --build
                ;;
            "schema")
                docker-compose exec mysql_db mysqldump -uMYSQL_USER -pMYSQL_PASSWORD eshop > setup.sql
                ;;
            "down")
                docker-compose down
                ;;
            "check")
                docker ps
                ;;
            "rebuild-api")
                docker-compose up --no-deps --build -d api
                ;;
            "rebuild-nginx")
                docker-compose up --no-deps --build -d nginx
                ;;
            "rebuild-client")
                docker-compose up --no-deps --build -d client
                ;;
            "rebuild-db")
                docker-compose up --no-deps --build -d mysql_db
                ;;
            "stop")
                docker-compose stop
                ;;
            "npm-install-client")
                docker-compose run client npm install
                ;;
            "npm-install-api")
                docker-compose run api npm install
                ;;
            "--help")
                echo "Available commands:"
                echo "up: Starts the services with docker-compose."
                echo "schema: Executes a MySQL dump of 'eshop' database into setup.sql."
                echo "down: Stops the services with docker-compose."
                echo "check: Displays the running containers with 'docker ps'."
                echo "rebuild-api: Rebuilds the 'api' service with docker-compose."
                echo "rebuild-nginx: Rebuilds the 'nginx' service with docker-compose."
                echo "rebuild-client: Rebuilds the 'client' service with docker-compose."
                echo "rebuild-db: Rebuilds the 'mysql_db' service with docker-compose."
                echo "stop: Stops all running containers with docker-compose."
                echo "npm-install-client: Installs npm dependencies for the 'client' service."
                echo "npm-install-api: Installs npm dependencies for the 'api' service."
                ;;
            *)
                echo "Command not found. Use 'make --help' to see available commands."
                ;;
        esac
    }


    ```
    Save the file and run `source ~/.bashrc` to apply the changes. Now, you can use the `make` command followed by your custom command, e.g., `make build` or `make schema`.

6. **Access the Database:**
    You can use a tool such as DBeaver to access the database. Configure the tool with the following details:
    - Host: localhost
    - Database: eshop
    - Username: root
    - Password: MYSQL_ROOT_PASSWORD
    - port: 9906
    - Ensure that allowPublicKeyRetrieval is enabled from:
    ``` 
    Open DBeaver and navigate to the connection settings for your MySQL connection.

    In the connection settings, locate the "Driver properties" or "Connection settings" section.

    Add the following parameter to the connection URL or the driver properties:

    allowPublicKeyRetrieval=true
    ```

    Alternatively, you can add the following configuration to your .yaml file:
    ```yaml
    adminer:
      image: adminer:latest
      restart: unless-stopped
      ports:
        - 8000:8080
      depends_on:
        - mysql_db
      environment:
        ADMINER_DEFAULT_SERVER: mysql_db
    ```
    Access it from the web browser port 8000.

7. **Setting up RAM for WSL2:**
    After installing Docker in Windows, changing settings for Docker requires configuring the Windows Subsystem for Linux version 2 (WSL2) to allocate the desired amount of memory and processing power. 

    To configure WSL2 and Docker's resources, follow these steps:

    1. Shut down Docker and any other running instances of WSL2 by opening a command prompt and executing the command:
       ```bash
       wsl --shutdown
       ```

    2. Create a `.wslconfig` file to set global configurations for all Linux distributions running on WSL2:
       - Open File Explorer and navigate to `%UserProfile%` to access your profile directory in Windows.
       - Create a new file named `.wslconfig` (ensure there are no `.txt` extensions).
       
    3. Add the following commands to the `.wslconfig` file to configure Docker resources (adjust as needed for your system's requirements):
       ```bash
       [wsl2]
       memory=4GB  # Limits VM memory to 4GB, modify as needed using GB or MB, recommended is at least 4GB to avoid build errors.
       processors=6  # Sets the VM to use 6 virtual processors, change for suitable amount for your computer.
       swap=4GB  # Sets swap storage space to 4GB, default if 25% of your max ram.
       # Add other configurations as per your system's needs
       ```
       
    4. Save the `.wslconfig` file and start Docker to apply the changes. Complete restart of the computer is recommended.

    Ensure to modify the memory, processor, and swap values according to your system's requirements and available resources.

## Notes
- Make sure that no other services are running on the ports that the project intends to use or change the port from docker-compose.yaml.
- Consult the project's documentation for any specific configurations or environment variables needed.
- Make schema will give out an error:
``` 
$ make schema
mysqldump: [Warning] Using a password on the command line interface can be insecure.
mysqldump: Error: 'Access denied; you need (at least one of) the PROCESS privilege(s) for this operation' when trying to dump tablespaces
```
  but it will work perfectly
