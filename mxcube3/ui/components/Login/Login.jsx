'use strict';
import React from 'react'
import { Input, ButtonInput } from "react-bootstrap";
import './Login.css';
import {reduxForm} from 'redux-form';

class Login extends React.Component {
  constructor(props) {
      super(props)
      this.signIn = this.signIn.bind(this);
      this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillMount(){
    this.props.getLoginInfo();  
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.status.code === "ok"){
      window.location.assign("#/"); 
      this.props.setLoading(false);
    }
  }
  
  signIn(){
      this.props.setLoading(true);
      let fields = this.props.fields;
      this.props.signIn(fields.username.value, fields.password.value);
  }
  handleKeyPress(target) {
    if(target.charCode==13){
      this.signIn();  
    }

  }

  render() {
      const {fields: {username, password}} = this.props;
      let loginInfo = this.props.loginInfo;

      return (
          <div>
          <div className="container">
          <div className="row row-centered">
          <div>
           <img src="../../img/mxcube_logo20.png" className="img-logo"/>
          </div>
          <h3 >Welcome to {loginInfo.beamline_name} at {loginInfo.synchrotron_name}</h3>
          <div className="col-md-5 col-centered">
          <div className="well well-left h5">
             <div>
                <form className="form from-actions" bsStyle="inline" >
                  <Input  label="LoginID" ref="proposal" type="text" name="proposal" placeholder={loginInfo.loginType} {...username} required autofocus/>{' '}
                  <Input  label="Password"  ref="password" type="password" name="password" placeholder="Password" {...password} required onKeyPress={this.handleKeyPress} />{' '}
                  <ButtonInput id="submit" bsStyle="primary"  value="Sign in"  onClick={this.signIn}/>
                </form>
              </div>
             </div>
            </div>
            </div>
            </div>
          </div>
          );
  }
}


Login = reduxForm({ // <----- THIS IS THE IMPORTANT PART!
  form: 'loginForm',                           // a unique name for this form
  fields: ['username', 'password'] // all the fields in your form
})(Login);

export default Login;