import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

class User extends Component {
    componentDidMount() {
        let path = window.location.pathname;
        if (Object.keys(this.props.userInfo).length === 0
            && !path.includes('login')) {
                browserHistory.push('/admin/login');
            }
    }
    render() {
        return (
            <div>{this.props.children}</div>
        );
    }
}

const mapUserInfoToProps = state => {
    return {
        userInfo: state.user.info
    };
}

export default connect(mapUserInfoToProps)(User);