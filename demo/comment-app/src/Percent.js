/**
 * Created by zhangchao on 2017/10/18.
 */

import React, {Component} from 'react'

class Input extends Component {
    handle(e) {
        if(this.props.onHandle){
            this.props.onHandle(e.target.value)
        }
    }

    render() {
        return (
                <input type='number' value={this.props.num} onChange={this.handle.bind(this)} />
        )
    }
}

class PercentageShower extends Component {
    static defaultProps = {
        res: 0
    }
    render () {
        return (
            <div>{this.props.res}</div>
        )
    }
}

class PercentageApp extends Component {
    constructor(){
        super();
        this.state = {
            num: 0,
            res: 0
        }
    }

    handleChange(num) {
        this.setState({
            num: num,
            res: (num * 100).toFixed(2) + '%'

        })
    }

    render () {
        return (
            <div>
                <Input onHandle={this.handleChange.bind(this)} num={this.state.num} />
                <PercentageShower res={this.state.res} />
            </div>
        )
    }
}

export default PercentageApp;