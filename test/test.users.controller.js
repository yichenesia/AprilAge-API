describe('<Integration Test>', () => {
  'use strict';

  import app from '../app.js';
  import request from 'supertest';
  const agent = request.agent(app);
  import atob from 'atob';
  import async from 'async';
  import _ from 'lodash';
  import userModel from '../models/user.model.js';

  const credentials = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'fake@email.com',
    name: 'fakename',
    password: 'password',
    phone: '123456789'
  };
  let currentUser = {};
  let token = '';

  describe('Invalid Users:', () => {
  beforeEach((done) => {
console.log('deleting');
    userModel.deleteByEmail(credentials.email).then(() => {
      done();
    });
  });

  it('should not register a user without an email', (done) => {
    let user = _.clone(credentials);
    delete user.email;
    request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        let errors = res.body;
        errors.length.should.equal(1);
        errors[0].msg.should.equal('Email is invalid');
        errors[0].param.should.equal('email');
        done();
      });
  });

  it('should register a user without a first name', (done) => {
    let user = _.clone(credentials);
    delete user.firstName;
    request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.have.property('token');
        done();
      });
  });

  it('should not register a user without a password', (done) => {
    let user = _.clone(credentials);
    delete user.password;
    request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        const errors = res.body;
        errors.length.should.equal(1);
        errors[0].msg.should.equal('Password not provided');
        errors[0].param.should.equal('password');
        done();
      });
  });

  it('should not register a user with a blank password', (done) => {
    let user = _.clone(credentials);
    user.password = '';
    request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        const errors = res.body;
        errors.length.should.equal(1);
        errors[0].msg.should.equal('Password not provided');
        errors[0].param.should.equal('password');
        done();
    });
  });


  it('should register a user without a Last Name', (done) => {
    let user = _.clone(credentials);
    delete user.lastName;
    request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.should.have.property('token');
        done();
      });
  });



  it('should report an error when email is invalid', (done) => {
    let user = _.clone(credentials);
    user.email = 'bad';
    request(app)
      .post('/users')
      .send(user)
      .end((err, res) => {
        res.status.should.equal(400);
        const errors = res.body;
        errors.length.should.equal(1);
        errors[0].msg.should.equal('Email is invalid');
        done();
      });
  });

  it('should require password to log in', (done) => {
      const badCredentials = {
        email: 'test@nopassword.com',
        password: ''
      };
      request(app)
        .post('/login')
        .send(badCredentials)
        .end((err, res) => {
        res.status.should.equal(400);
      const errors = res.body;
      errors.length.should.equal(1);
      errors[0].msg.should.equal('Invalid email or password');
      done();
    });
  });

  it('should require password to be defined to log in', (done) => {
      const badCredentials = {
        email: 'test@nopassword.com'
      };
      request(app)
        .post('/login')
        .send(badCredentials)
        .end((err, res) => {
        res.status.should.equal(400);
      const errors = res.body;
      errors.length.should.equal(1);
      errors[0].msg.should.equal('Invalid email or password');
      done();
    });
  });

  it('should require email to log in', (done) => {
    const badCredentials = {
      password: 'password'
    };
    request(app)
      .post('/login')
      .send(badCredentials)
      .end((err, res) => {
        res.status.should.equal(400);
        const errors = res.body;
        errors.length.should.equal(1);
        errors[0].msg.should.equal('Invalid email or password');
        done();
      });
  });

  it('should not allow a non system user to log in', (done) => {
    const badCredentials = {
      email: 'fake@email.com',
      password: 'fake'
    };
    request(app)
      .post('/login')
      .send(badCredentials)
      .end((err, res) => {
        res.status.should.equal(400);
        const errors = res.body;
        errors.length.should.equal(1);
        errors[0].msg.should.equal('Invalid email or password');
        done();
      });
  });
  });

  describe('Valid Users:', () => {
    let verifyUserFields = (user) => {
      user.should.have.property('id');
      user.should.have.property('email');
      user.should.have.property('role');
      user.should.not.have.property('hashedPassword');
      user.should.not.have.property('salt');
    };

    it('should register a user', (done) => {
      let user = _.clone(credentials);
      request(app)
        .post('/users')
        .send(user)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.have.property('token');
          done();
        });
    });

    it('should log user in using email/password', (done) => {
      const creds = _.pick(credentials, 'email', 'password');
      agent.post('/login')
        .send(creds)
        .end((err, res) => {
          res.status.should.equal(200);
          res.body.should.have.property('token');

          token = res.body.token;
          const encodedUser = token.split('.')[1];
          currentUser = JSON.parse(atob(encodedUser));

          done();
        });
    });

    describe('update password', () => {
      it('should return error when no password is provided', (done) => {
        async.waterfall([
          (callback) => {
            request(app)
              .put('/users/' + currentUser.id + '/password')
              .send({})
              .set('authorization', 'Bearer ' + token)
              .end(callback);
          }
        ], (err, res) => {
          res.status.should.equal(400);

          const errors = res.body;
          errors.should.have.length(1);

          const error = errors[0];
          error.should.have.property("msg");
          error.msg.should.equal("Please provide a password");

          done();
        });
      });

      it('should not update password if the password is null', (done) => {
        const payload = {
          password: null
        };
        async.waterfall([
          (callback) => {
            request(app)
              .put('/users/' + currentUser.id + '/password')
              .send(payload)
              .set('authorization', 'Bearer ' + token)
              .end(callback);
          }
        ], (err, res) => {
          res.status.should.equal(400);

          const errors = res.body;
          errors.should.have.length(1);

          const error = errors[0];
          error.should.have.property("msg");
          error.msg.should.equal("Please provide a password");

          done();
        });
      });

      it('should not update password if the password is empty', (done) => {
        const payload = {
          password: ""
        };
        async.waterfall([
          (callback) => {
            request(app)
              .put('/users/' + currentUser.id + '/password')
              .send(payload)
              .set('authorization', 'Bearer ' + token)
              .end(callback);
          }
        ], (err, res) => {
          res.status.should.equal(400);

          const errors = res.body;
          errors.should.have.length(1);

          const error = errors[0];
          error.should.have.property("msg");
          error.msg.should.equal("Please provide a password");

          done();
        });
      });


      it('should update the password', (done) => {
        const password = "newpassword";
        const payload = {
          password: password
        };
        async.waterfall([
          (callback) => {
            request(app)
              .put('/users/' + currentUser.id + '/password')
              .send(payload)
              .set('authorization', 'Bearer ' + token)
              .end((err, res) => {
                res.status.should.equal(200);
                callback(err, res);
              });
          },
          (res, callback) => {
            const newCredentials = {
              email: currentUser.email,
              password: password
            };
            request(app)
              .post('/login')
              .send(newCredentials)
              .end(callback);
          }
        ], (err, res) => {
          res.body.should.have.property('token');
          done();
        });
      });
    });

    describe('with reset key', () => {
      let resetKey;

      beforeEach((done) => {
        agent.put('/users/reset')
          .send({
            email: credentials.email
          })
          .end((err, res) => {
            res.status.should.equal(200);
            userModel.findById(currentUser.id).then((user) => {
              resetKey = user.resetKey;
              done();
            });
          });
      });

      describe('resets password', () => {
        const password = 'newpassword';

        beforeEach((done) => {
          agent.put('/users/reset/' + resetKey)
            .send({
              password: password
            })
            .end((err, res) => {
              done();
            });
        });

        it('should use reset key to reset password', (done) => {
          const newCredentials = {
            email: credentials.email,
            password: password
          };
          request(app)
            .post('/login')
            .send(newCredentials)
            .end((err, res) => {
              res.body.should.have.property('token');
              done();
            });
        });

        it('should not allow user to log in with old password', (done) => {
          request(app)
            .post('/login')
            .send(credentials)
            .end((err, res) => {
              const errors = res.body;
              const error = errors[0];
              error.msg.should.equal('Invalid email or password');
              done();
            });
        });

        it('should clear reset key after it is used', (done) => {
          agent.put('/users/reset/' + resetKey)
            .send({
              password: password
            })
            .end((err, res) => {
              res.status.should.equal(404);
              done();
            });
        });
      });

      it('should return bad request when no new password is provided', (done) => {
        agent.put('/users/reset/' + resetKey)
          .send()
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
      });

      it('should return bad request when new password is blank', (done) => {
        agent.put('/users/reset/' + resetKey)
          .send({password: ''})
          .end((err, res) => {
            res.status.should.equal(400);
            done();
          });
        });
      });

    it('should return 404 if user is not found', (done) => {
      agent.put('/users/reset')
        .send({
          email: 'blabber@blabber.com'
        })
        .end((err, res) => {
          res.status.should.equal(404);
          done();
        });
    });

    it('should return an error if no email is provided', (done) => {
      agent.put('/users/reset')
        .send({})
        .end((err, res) => {
          res.status.should.equal(400);
          res.body.msg.should.equal('No email provided');
          done();
        });
    });


    it('should list logged in user', (done) => {
      request(app)
        .get('/users/me')
        .set('authorization', 'Bearer ' + token)
        .end((err, res) => {
          const user = res.body;
          verifyUserFields(user);
          done();
        });
    });

    it('should include user in result', (done) => {
      const encodedUser = token.split('.')[1];
      const user = JSON.parse(atob(encodedUser));
      user.email.should.equal('fake@email.com');
      done();
    });

    it('should allow a user to log in', (done) => {
      request(app)
        .post('/login')
        .send(credentials)
        .end((err, res) => {
          res.body.should.have.property('token');
          done();
        });
    });


    it('should be able to update yourself', (done) => {
      currentUser.firstName = 'test update';
      request(app)
        .put('/users/' + currentUser.id)
        .send(currentUser)
        .set('authorization', 'Bearer ' + token)
        .end((err, res) => {
          res.status.should.equal(200);
          const user = res.body;
          verifyUserFields(user);
          user.should.have.property('firstName');
          done();
        });
    });


  });
  after((done) => {
    // cleanup DB by deleting users we created
    userModel.deleteByEmail('fake@email.com').then(() => {
      done();
    });
  });
});
