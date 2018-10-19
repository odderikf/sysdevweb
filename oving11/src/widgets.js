import * as React from 'react';
import { Component } from 'react-simplified';

export class Card extends Component {
  static defaultProps = {
    title: 'title',
    subtitle: ''
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{this.props.title}</h5>
          <h6 className="card-subtitle">{this.props.subtitle}</h6>
          {this.props.children}
        </div>
      </div>
    );
    // <Card title="hei" subtitle="sjokolade"><p> Hei </p></Card>
  }
}

export class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-primary" {...this.props}>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            {this.props.children.map(child =>
              <li className="nav-item active">
                <div className="nav-link">{child}</div>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}


export class ListGroup extends Component {
  render() {
    return (
      <ul className="list-group">
        {this.props.children}
      </ul>
    );
  }

  static Item = class extends Component {
    render() {
      return (
        <li className="list-group-item" {...this.props}>
          {this.props.children}
        </li>
      );
    }
  };
}

export class Form {
  render() {
    return (
      <form>{this.props.children}</form>
    );
  }

  static Input = class extends Component {
    render() {
      return (
        <input className="form-control" {...this.props}>{this.props.children}</input>
      )
    }
  };

  static Label = class extends Component {
    render() {
      return (
        <label {...this.props}>{this.props.children}</label>
      )
    }
  };

  static Entry = class extends Component {
    render() {
      return (
        <div className="form-group bg-light" {...this.props}>
          {this.props.children}
        </div>
      )
    }
  };

  static Submitter = class extends Component {
    static defaultProps = {
      children : "Submit"
    };

    render() {
      return (
        <button type="submit" className="btn btn-primary" {...this.props}>{this.props.children}</button>
      )
    }
  };
}

export class Button extends Component {
  render() {
    return (
      <input type="button" className="btn btn-primary" {...this.props} />
    )
  }
  static Danger = class extends Component{
    render() {
      return (
        <input type="button" className="btn btn-danger" {...this.props} />
      )
    }
  }
}

export class Alert extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: false,
      message: "",
      alert_type: "alert-primary"
    };
  }

  handleClose() {
    this.None();
  }

  render() {
    if (this.state.active) {
      return (
        <div className={"alert " + this.state.alert_type} {...this.props}>
          {this.state.message}

          <button type="button" className="close" aria-label="Close" onClick={e=>this.handleClose()}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    } else return null;
  }

  Danger(message="Danger"){
      this.setState({active: true, message: message, alert_type: "alert-danger"})
  }

  Success(message="Success"){
    this.setState({active: true, message: message, alert_type: "alert-success"})
  }

  Warning(message="Danger"){
    this.setState({active: true, message: message, alert_type: "alert-warning"})
  }

  None(){
    this.setState({active: false, message: "", alert_type:"alert-primary"})
  }
}