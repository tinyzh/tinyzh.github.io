/**
 * Created by zhangchao on 2017/10/18.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment'


class CommentList extends Component {
    static propTypes = {
        comments: PropTypes.array,
        onDeleteComment: PropTypes.func
    }

    static defaultProps = {
        comments: []
    }

    handleDeleteComment(index){
        if(this.props.onDeleteComment){
            this.props.onDeleteComment(index)
        }
    }

    render() {
        return (
            <div>{this.props.comments.map((comment,i) => {
                return (
                    <Comment
                        comment={comment}
                        key={i}
                        index={i}
                        onDeleteComment={this.handleDeleteComment.bind(this)}
                    />
                )
            })}</div>
        )
    }
}

export default CommentList;