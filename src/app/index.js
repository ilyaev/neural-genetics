import Render from './components/render'
const target = document.getElementById('app')

// const barker = (state) => ({
//     bark: () => console.log('Woof, i am ' + state.name)
// })

// const driver = (state) => ({
//     drive: () => state.position = state.position + state.speed
// })

// const robotDog = (name) => {
//     let state = {
//         name,
//         speed: 100,
//         position: 0
//     }

//     return Object.assign(
//         {},
//         barker(state),
//         driver(state),
//         {
//             getState: () => state
//         }
//     )

// }

// let robot = robotDog('sniffles')
// robot.bark()
// robot.drive()
// console.log(robot.getState())




window.onload = () => {

    const demo = new Render(target)
    return demo

}