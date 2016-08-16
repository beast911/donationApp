# donation-app - Donation app for people

Donation app allows people to donate money for



## Getting Started
To initialize the application run:

npm install
bower install


### Prerequisites

You will need NodeJS installed (no specific version required although it should be above 0.10.x)


### Run the Application

To create the deployable, please use

gulp


### Running the App during Development

For development purpose(uncompressed JS and CSS files), we have

gulp --type develop

And then deploy in your local webserver. If you don't have any webserver, we have bundled http-server which can be called by either 

gulp deploy  (After running the above command)

Or, you can run in one command

gulp --type develop --deploy true

### Running the App in Production

To have production ready application, you can run either

gulp

Or

gulp --type release

The deployable created by the above command is production ready and can be tested in any local server if you have, or you can use
the bundled server to do the final round of testing by using command

gulp --type release --deploy true



