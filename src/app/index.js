import Render from './components/render'
const target = document.getElementById('app')


window.onload = () => {

    const demo = new Render(target)
    return demo

}