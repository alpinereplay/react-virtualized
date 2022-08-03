import { DOMElement, DOMAttributes } from "react"
import * as ReactDOM from "react-dom"

/**
 * Helper method for testing components that may use Portal and thus require cleanup.
 * This helper method renders components to a transient node that is destroyed after the test completes.
 * Note that rendering twice within the same test method will update the same element (rather than recreate it).
 */
let MountNode: any = null
export function render(markup: any) {
    if (!MountNode) {
        MountNode = document.createElement("div")
        // Unless we attach the mount-node to body, getBoundingClientRect() won't work
        document.body.appendChild(MountNode)
        afterEach(render.unmount)
    }

    return ReactDOM.render(markup, MountNode)
}

/**
 * The render() method auto-unmounts components after each test has completed.
 * Use this method manually to test the componentWillUnmount() lifecycle method.
 */
render.unmount = function () {
    if (MountNode) {
        ReactDOM.unmountComponentAtNode(MountNode)
        document.body.removeChild(MountNode)
        MountNode = null
    }
}
