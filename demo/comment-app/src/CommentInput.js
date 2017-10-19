/**
 * Created by zhangchao on 2017/10/18.
 */
import React, { Component } from 'react';

class CommentInput extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            content: ''
        }
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount(){
        this._loadUsername();
    }

    componentDidMount(){
        this.textarea.focus();
    }

    handleUsernameChange(event){
        this.setState({
            username: event.target.value
        });
    }

    handleContentChange(event){
        this.setState({
            content: event.target.value
        });
    }

    handleSubmit() {
        if(this.props.onSubmit){
            const {username,content} = this.state;
            this.props.onSubmit({
                username,
                content,
                createdTime: +new Date()
            })
        }
        this.setState({content: ''})
    }

    _saveUsername(username){
        localStorage.setItem('username', username);
    }

    _loadUsername() {
        const username = localStorage.getItem('username');
        if(username){
            this.setState({username})
        }
    }

    handleUsernameBlur(event){
        this._saveUsername(event.target.value)
    }




    render() {
        return (
           <div className="comment-input">
               <div className="comment-field">
                   <span className="comment-field-name">用户名：</span>
                   <div className="comment-field-input">
                       <input type="text"
                              value={this.state.username}
                              onChange={this.handleUsernameChange}
                              onBlur={this.handleUsernameBlur.bind(this)}
                       />
                   </div>
               </div>
               <div className="comment-field">
                   <span className="comment-field-name">评论内容：</span>
                   <div className="comment-field-input">
                       <textarea
                           value={this.state.content}
                           onChange={this.handleContentChange}
                           ref={(textarea) => this.textarea = textarea }/>
                   </div>
               </div>
               <div className="comment-field-button">
                   <button onClick={this.handleSubmit}>
                       发布
                   </button>
               </div>
           </div>
        )
    }
}

export default CommentInput;