import React from 'react'

const LoginForm = () => {
  return (
    <div className="container login-form">
            <div className="well bs-component">
              <form className="form-horizontal">
                <fieldset>
                  <legend>Login</legend>
                  <div className="form-group">
                    <label htmlFor="inputEmail" className="col-lg-2 control-label">Email</label>
                    <div className="col-lg-10">
                      <input type="text" className="form-control" id="inputEmail" placeholder="Email" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputPassword" className="col-lg-2 control-label">Password</label>
                    <div className="col-lg-10">
                      <input type="password" className="form-control" id="inputPassword" placeholder="Password" />
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" /> Remember Me
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-lg-10 col-lg-offset-2">
                      <button type="reset" className="btn btn-default">Cancel</button>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                  </div>
                </fieldset>
              </form>
        </div>
      </div>
        )
}

export default LoginForm