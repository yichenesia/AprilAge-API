#Deploy API
Set up Reveal API.  based in Node.js

#Admin endpoint for users

#normal users possibly

#admin can upload file


##App.js
Main entrance app

#Config
in config/config.js
Config file to use process.env.API

##Routes
routes/index.js
routes/user.routes.js
The http endpoints you can call
Route to controller

##Controllers
controllers
Handle a call
Returns the result

##Services
services
More detailed processes

##Models
models
Models for objects, generally model -> db table

#Project Stuff
#Project Demo  Setup

This is a server for setting up taxday demo site.  It involves setting up 2 projects on 1 server:
project.api (api)
project.web (web)

##Requirements

To set up the Project Demo, you will need the following things:

reveal.api
reveal.web

If you don't have git credentials, you will need to use the .zip file.

Admin Credentials for Following Bitbucket projects (To set up ssh keys for server)
  
  Taxplan.admin
  Taxplan.api

AWS Credentials for the following services (For running server & db):
  EC2
  RDS
  ECS Security Groups

Sparkpost Credentials (For Emails)

Stripe (for payments)

###Credentials
  There are many credentials needed.  We recommend storing them in Lastpass (an online password saver).  If you use it, any time we mention credentials, you can just fetch them from lastpass.


##Creating Server
We need to create a server to run the 3 projects.
It should run on AWS.

### Create Instance of Server
  Log into aws with ec2 permissions.
  Go to Services > EC2 > Running Instances
  Press 'Launch Instance' to create a new instance.
  Choose Ubuntu Server instance (16.04 as of this document)
  Select Free Tier (usually t2.micro)
  Use the defaults for everything
  Add a Tag with Key of 'Name' and fill in the name of your server ('i.e Taxday Demo Site 2')
  For the ssh private Key (xxx.pem), you can use the 'taxday_demo' key if you have it (in lastpass), or create a new key.  IF you create a new key, MAKE SURE TO ADD IT INTO LASTPASS.
  Create the Instance
  Go back to the panel, and wait for your instance to Spin up (you can see that under instance state)

### Adding Security Credentials
  Click on your server (referenced by name)
  Go to the description, under "security groups", and click on the security group (usually called "launch-wizard-5" or something, if you used default).
  Click on "inbound", and edit the list, adding the following inbound entries:
  NOTE: For the Range of SSH, you might want to limit this to your IP (i.e. The Office), instead of available everywhere

```
Type         Protocol   Port   Source      Description
HTTP         TCP        80     0.0.0.0/0   Server Apache Admin
SSH          TCP        22     0.0.0.0/0   SSH for site
Custom TCP   TCP        3001   0.0.0.0/0   Node Server API
Custom TCP   TCP        3000   0.0.0.0/0   Node Server Web
```

### Logging into Server
With your .pem key, log into the server.
The address for your server is under the instance details, something like:
public dns: ec2-54-157-5-126.compute-1.amazonaws.com

Make sure your keyname.pem file has the credentials "600"
to make sure, run chmod:

```
chmod 600 keyname.pem
```

Then login to server using ssh, with the username 'ubuntu' (default user for aws ubuntu instances)
```
ssh -i keyname.pem ubuntu@serveraddress
```

## Get Project files

You will need to pull your project files from a git repository.  We use bitbucket.

If you don't have a git repo set up, you likely have the project zipped - you can ssh ftp the files onto the server instead.

### Create SSH Keys

once you are logged in, create public keys using the following instructions:
  https://confluence.atlassian.com/bitbucketserver/creating-ssh-keys-776639788.html

copy the public key into your clipboard. You will need to paste this into bitbucket ssh keys.
The public key should be like:
```
ssh-rsa AGDKJHEFJLKS2234lkjgd+sjk3rl2rlkj.... 
```


You can either cat the file like so:
```
cat id_rsa.pub
```

And then copy the text that is output on the terminal, or on your personal machine, use ssh to copy the file into your clipboard

(Assuming your local machine's terminal, and your local machine is OSX (if your local is linux, use xclip instead of pbcopy)

```
ssh -e none -i ssh_key.pem ubuntu@ec2-54-157-5-126.compute-1.amazonaws.com "cat /home/ubuntu/.ssh/id_rsa.pub" | pbcopy 
```

###Give your server credentials in bitbucket

Log into Bitbucket with admin credentials for your projects (project.web, project.api) 
Go to project repository
Click settings > access Keys > add Key
Label the key with a name (i.e. projectdemosshkey)
and paste the public key into the 'key' textbox.

Do this for each project (project.api & project.web)


### Pull projects

Log back onto the server

create a folder for your projects, change to that directory, and clone all the repositories
```
mkdir taxdaydemo2
cd taxdaydemo2
git clone git@bitbucket.org:ellefsontech/project.api.git
git clone git@bitbucket.org:ellefsontech/project.web.git
```

## Create Database
Go back to AWS, and go to RDS
services > RDS > DB Instances > Launch DB Instance
Launch a MySQL instance (dev / test version)
Use the Free Tier (click 'only show options that are eligible for RDS Free Tier).
Create the DB settings, and make sure you save these things.
```
###EXAMPLE:
DB Instance: instanceName 
Master UserName: useradminname
Master Password: xxxxx
Confirm Password: xxxxx
```
Make sure you save all this information for later use.

Fill in remaining information, using defaults.

After creation, you will need to add security information.  
Click on the magnifier glass icon, and click the security group (rds-launch-wizard-3 or something} and press inbound and edit.
You should add at least 2 entries, 1 for your current personal IP, and also for the server.

For the api server source, use its security group id: Click on the server's security group, and use the 'Group ID' i.e. sg-8bb788..


```
Type         Protocol   Port   Source      Description
...
Custom TCP   TCP        3306   sg-71235...   Your New project server
Custom TCP   TCP        3306   69.165.170.51/32   Office
```

### Clone DB instance
In the project.api, there is a test data sql script to initialise the DB. It is in db/ folder as create-test-server.sql

Log onto the SQL server using the root credentials you supplied when creating the server.
```
###EXAMPLE
hostname: projectname.cu9s32jksac.us-east-1.rds.amazonaws.com
username: yourAdminName
port:3306
password:xxxx
```

Run the SQL script on the created database.


## Install dependencies.
Log back onto the api server.
Install the following dependencies on the api server:

```
sudo apt-get install apache2
```

###Install NodeJS
Install node (this is for version 7.x, which should be compatible.  8.x is not fully compatitable with out stuff):

// https://stackoverflow.com/questions/14772508/npm-failed-to-install-time-with-make-not-found-error
// https://github.com/nodejs/node-gyp/issues/233

To install, DO NOT use the base one, use the following:
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs

```

install npm global packages (you may need to use sudo)
```
(sudo) npm install forever -g
```

##project.api Install

Follow the instructions below.  there is a supplementary old document readme.txt, but you shouldn't have to look at it.

### create env.sh info
copy the env.sh file as env.sh.example

```
cp env.sh.example env.sh
vim env.sh
```

You will need to fill in all the credentials.  The server & db are from what you created, sparkpost app & stripe credentials.

```
#!/bin/bash                                                                 
export ...="/"
```  

### Test server
You can test this using forever

```
. env.sh
forever start server.js
```

You can use forever list to see if it works and forever stopall to stop all forever processes
```
forever list
forever stopall
```

You will need to make a note of the port in which you are running the api.

##Install Web

###Install dependencies
```
npm install
```

##Project.web
Update the env.sh from env.sh.example
Run webpack-prod

```
. env.sh
npm run webpack-prod
```

###Create link to project
create a symlink to the src folder in your html folder
```
sudo ln -s /home/ubuntu/projectname/projectname.web/src /var/www/html/projectname.web
```

### config
On your apache server, change config to point to projectname.web, and also to redirect traffic to /api to your projectname.api
.
it should be the file: 
/etc/apache2/sites-available/000-default.conf

```
cd /etc/apache2/sites-available
vim 000-default.conf
```
vim is a text editor with special commands feel free to use whatever text editor you like
(important vim commands are 'i' to change into insert mode to start editing the document, 'esc' to go back to command mode, and 'w!' to save your changes while in command mode, and 'q' to quit editing the file.

Initialise the following modules
```
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod ssl

```

Edit the file to point to your project files, like so:
```
<VirtualHost *:80>
        # The ServerName directive sets the request scheme, hostname and port that
        # the server uses to identify itself. This is used when creating
        # redirection URLs. In the context of virtual hosts, the ServerName
        # specifies what hostname must appear in the request's Host: header to
        # match this virtual host. For the default virtual host (this file) this
        # value is not decisive as it is used as a last resort host regardless.
        # However, you must set it for any further virtual host explicitly.
        #ServerName www.example.com

        ServerAdmin webmaster@localhost
        DocumentRoot /var/www/html/projectname.web
  RewriteEngine on
  RewriteCond %{SERVER_NAME} =your.servername.com
  RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
  <Directory "/var/www/html/projectname.web">

        RewriteEngine on
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        RewriteRule ^ index.html [L]

        # Available loglevels: trace8, ..., trace1, debug, info, notice, warn,
        # error, crit, alert, emerg.
        # It is also possible to configure the loglevel for particular
        # modules, e.g.
        #LogLevel info ssl:warn

  </Directory>

        ErrorLog ${APACHE_LOG_DIR}/error.log
        CustomLog ${APACHE_LOG_DIR}/access.log combined
        ProxyRequests on
        #pass requests to api to your projectname.api node service
        ProxyPass /api http://your.projectname.com:3001

        # For most configuration files from conf-available/, which are
        # enabled or disabled at a global level, it is possible to
        # include a line for only one particular virtual host. For example the
        # following line enables the CGI configuration for this host only
        # after it has been globally disabled with "a2disconf".
        #Include conf-available/serve-cgi-bin.conf
</VirtualHost>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet```
```

###restart apache server 
```
sudo service apache2 reload
```

After this, you should be able to go to the admin page, assuming the api is running, and see the admin site!

## SETTING UP RESTART SCRIPT
After all this, you need to set up forever to run, and also for it to run in a crontab.

https://stackoverflow.com/questions/13385029/automatically-start-forever-node-on-system-restart

put this in crontab so it restarts

```
 crontab -u ubuntu -e
```

Add the environmental variables for the API & Web.2, as well as the code to run at the end of this file, so it starts on reboot:

Use the environment variables from the env.sh scripts you edited above


```
# Same as env.sh file, but remove the 'export' prefixes
EXPORT_VARS_BUT_REMOVE_EXPORT_PREFIX="/"
PROJECT_PORT="3001"
...
EXPORT

#Should point first go to folder of api project, then run server file
@reboot cd /home/ubuntu/projectname/projectname.api && /usr/bin/forever start server.js
```

This is essentially the environmental variables plus an execution script.

### reboot server to test
Once you have done this, you should reboot the server, and everything should still be running!
```
sudo reboot
```

## The sites
Once everything is done, assuming you have it set up correctly, you should have the following sites:

awsserver.com:80 > main site
awsserver.com:80/api > API 


## Setting up HTTPS
If you want https, followin the following instructions:
https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-16-04

## Troubleshooting

### NPM install
If your npm install fails, try deleting your node_modules folder for that project and trying again.

```
cd taxplan.api
rm -R node_modules
```

### CORS issues
Often times if you load admin or web, and in your debug console you are getting CORS issues, you have't filled the 'CORS' setting on the API correctly.  Make sure it has the full address, including protocol and port, ie. http://awssite.com:3000.




