import * as React from "react";
import Actions from "../model/Actions";
import TabNode from "../model/TabNode";
import TabSetNode from "../model/TabSetNode";
import { JSMap } from "../Types";
import Layout from "./Layout";

/** @hidden @internal */
export interface ITabProps {
    layout: Layout;
    selected: boolean;
    node: TabNode;
    factory: (node: TabNode) => React.ReactNode;
}

/** @hidden @internal */
export class Tab extends React.Component<ITabProps, any> {

    constructor(props: ITabProps) {
        super(props);
        this.state = { renderComponent: !props.node.isEnableRenderOnDemand() || props.selected };
    }

    componentDidMount() {
        // console.log("mount " + this.props.node.getName());
    }

    componentWillUnmount() {
        // console.log("unmount " + this.props.node.getName());
    }

    static getDerivedStateFromProps(newProps: ITabProps, state: any) {
        if (!state.renderComponent && newProps.selected) {
            // load on demand
            // console.log("load on demand: " + this.props.node.getName());
            return { renderComponent: true };
        }
        return null;
    }

    // componentWillReceiveProps(newProps: ITabProps) {
    //     if (!this.state.renderComponent && newProps.selected) {
    //         // load on demand
    //         // console.log("load on demand: " + this.props.node.getName());
    //         this.setState({ renderComponent: true });
    //     }
    // }

    onMouseDown = () => {
        const parent = this.props.node.getParent() as TabSetNode;
        if (parent.getType() === TabSetNode.TYPE) {
            if (!parent.isActive()) {
                this.props.layout.doAction(Actions.setActiveTabset(parent.getId()));
            }
        }
    }

    render() {
        const cm = this.props.layout.getClassName;

        const node = this.props.node;
        const parentNode = node.getParent() as TabSetNode;
        const style: JSMap<any> = node._styleWithPosition({
            display: this.props.selected ? "block" : "none"
        });

        if (parentNode.isMaximized()) {
            style.zIndex = 100;
        }

        let child;
        if (this.state.renderComponent) {
            child = this.props.factory(node);
        }

        return <div className={cm("flexlayout__tab")}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onMouseDown}
            style={style}>{child}
        </div>;
    }
}

// export default Tab;
