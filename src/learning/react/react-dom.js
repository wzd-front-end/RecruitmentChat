import {initVNode} from './vdom'

function render(vnode, container){
  const node = initVNode(vnode);
  container.appendChild(node);
}
export default {render}
