import React from "react";



class Outclick extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newChildren: this.genNewChild()
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside, true);
    }

    elements = [];

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props)
            this.setState({ ...this.state, newChildren: this.genNewChild() })
    }

    genNewChild = () => {
        this.elements = [];
        return React.Children.toArray(this.props.children).map((child) => {
            const elementRef = React.createRef();
            let component = React.cloneElement(child, { ref: elementRef })
            this.elements.push(elementRef)
            return component
        })
    }

    handleClickOutside = (event) => {
        let outClickElements = 0;
        this.elements.forEach(element => {
            if (!element.current.contains(event.target))
                outClickElements++;
        });
        if (this.elements.length <= outClickElements && this.props.callback)
            this.props.callback()
    }

    render() {
        return <>{this.state.newChildren}</>
    }
}

export default Outclick