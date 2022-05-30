const container = document.querySelector(".container")

let playerLeftSpace = 50
let startingPoint = 150
let playerBottomSpace = startingPoint
const player = document.getElementsByClassName("player")[0]

class Ground {
    constructor(newGroundBottom) {
        this.bottom = newGroundBottom
        this.left = Math.random() * 325
        this.visual = document.createElement("div")

        const visual = this.visual
        visual.classList.add("ground")
        visual.style.left = this.left + "px"
        visual.style.bottom = this.bottom + "px"
        container.appendChild(visual)
    }
}

let groundCount = 5
let grounds = []

class NFT{
    constructor(newNFTBottom){
        this.bottom = newNFTBottom
        this.left = Math.random() * 325
        this.visual = document.createElement("div")

        const visual = this.visual
        visual.classList.add("nft")
        visual.style.left = this.left + "px"
        visual.style.bottom = this.bottom + "px"
        container.appendChild(visual)
    }
}



function createPlayer() {
    player.classList.add("player")
    player.style.bottom = playerBottomSpace + "px"
    player.style.left = grounds[0].lef
    container.appendChild(player)
}



function createGrounds(){
    for (let index = 0; index < groundCount; index++) {
        let groundGap = 700 / groundCount
        let groundBottom = 100 + index * groundGap
        let ground = new Ground(groundBottom)
        grounds.push(ground)
    }
}

window.nftScore = 0
function checkIfCollectNft() {
    let nft = nfts[0]
    if(
        playerBottomSpace >= nft.bottom &&
        playerBottomSpace <= nft.bottom + 50 &&
        ((playerLeftSpace + 50) >= nft.left) &&
        playerLeftSpace <= nft.left + 50
    ){
        console.log("NFT Collected !")
        window.nftScore += 1
        let nftOne = nfts[0].visual
        nftOne.classList.remove("nft")
        nfts.shift()

        let newNFT = new NFT(580)
        nfts.push(newNFT)
    }
}

let score = 0
let grid = document.getElementsByClassName("grid-container")[0]
let scoreElement = document.getElementById("score")
let nftScoreElement = document.getElementById("nftScore")
let nfts = [new NFT(500)]

function moveNFTs(){
    if(playerLeftSpace > 200){
        nfts.forEach(nft => {
            nft.bottom -= 4
            let visual = nft.visual
            visual.style.bottom = nft.bottom + "px"

            if(nft.bottom < 10){
                let nftOne = nfts[0].visual
                nftOne.classList.remove("nft")
                nfts.shift()
                console.log(grounds)
                let newNFT = new NFT(580)
                nfts.push(newNFT)
            }
        })
    }
}

function moveGrounds(){
    if(playerLeftSpace > 200){
        grounds.forEach(ground => {
            ground.bottom -= 4
            let visual = ground.visual
            visual.style.bottom = ground.bottom + "px"

            if(ground.bottom < 10){
                let groundOne = grounds[0].visual
                groundOne.classList.remove("ground")
                grounds.shift()
                console.log(grounds)
                let newGround = new Ground(700)
                grounds.push(newGround)
            }
        })
    }
}

let upTimerId
let downTimerId


function jump(){
    clearInterval(downTimerId)
    isJumping = true
    upTimerId = setInterval(() => {
        checkIfCollectNft()
        playerBottomSpace += 20
        player.style.bottom = playerBottomSpace + "px"
        if(playerBottomSpace > startingPoint + 180){
            fall()
        }
    }, 30);
}





let isGoingLeft
let isGoingRight
let leftTimerId
let rightTimerid

function moveLeft(){
    if(isGoingRight){
        clearInterval(rightTimerid)
        isGoingRight = false
    }
    isGoingLeft = true
    leftTimerId = setInterval(() => {
        if (playerLeftSpace >= 0) {
            playerLeftSpace -= 5
            player.style.left = playerLeftSpace + "px"
        }
    }, 20);
}

function moveRight(){
    if(isGoingLeft){
        clearInterval(leftTimerId)
        isGoingLeft = false
    }
    isGoingRight = true
    rightTimerId = setInterval(() => {
        if (playerLeftSpace <= 450) {
            playerLeftSpace += 5
            player.style.left = playerLeftSpace + "px"
        } else {
            moveLeft()
        }
    }, 30);
}

function stopMoving(){
    isGoingLeft = false
    isGoingRight = false
    clearInterval(rightTimerId)
    clearInterval(leftTimerId)
}

function fall(){
    clearInterval(upTimerId)
    isJumping = false
    downTimerId = setInterval(() => {
        playerBottomSpace -= 5
        player.style.bottom = playerBottomSpace + "px"

    if(playerBottomSpace <= 0){
        endGame()
    }
    checkIfCollectNft()
    grounds.forEach(ground => {
    if( 
        (playerBottomSpace >= ground.bottom) &&
        (playerBottomSpace <= ground.bottom + 15) &&
        ((playerLeftSpace + 50) >= ground.left) &&
        (playerLeftSpace <= (ground.left + 75)) &&
        (!isJumping)
    ) {
        jump()
        startingPoint = playerBottomSpace
    }
});
}, 30);
}


function loadImageOfMintedNfts(){
    for (let index = 1; index < 10; index++) {
        if(localStorage.getItem(index.toString())){
            console.log(`element with ID ${index} is minted !`)
            const nft1 = document.getElementById(index)
            const att = document.createAttribute("style")
            att.value = `content:url(./skins/${index}.png)`
            nft1.setAttributeNode(att)
        }
        
    }
}


let isGameOver = false
function startGame() {
    console.log("A")
    if(!isGameOver) {
        console.log("B")
        createGrounds()
        createPlayer()
        setInterval(moveGrounds(), 30)
        setInterval(moveNFTs(), 30)
        jump()
        document.addEventListener("keyup", onKeyPress)
    }
}

function endGame() {

    isGameOver = true
    loadImageOfMintedNfts()
    grounds.forEach(ground => {
        let groundOne = ground.visual
        groundOne.classList.remove("ground")
    });
    grounds = []

    nfts.forEach(nft => {
        let nftOne = nft.visual
        nftOne.classList.remove("nft")
    });

    player.classList.add("hide")
    grid.classList.remove("hide")
    scoreElement.innerText = "Score : " + score
    nftScoreElement.innerHTML = "NFT Score : " + window.nftScore
    scoreElement.classList.remove("hide")
    nftScoreElement.classList.remove("hide")

    clearInterval(rightTimerid)
    clearInterval(leftTimerId)
    clearInterval(downTimerId)
    clearInterval(upTimerId)
}

function restartGame(){
    console.log("restart")
    isGameOver = false
    player.classList.remove("hide")
    grid.classList.add("hide")
    score = 0
    nftScore = 0
    startGame()
    scoreElement.classList.add("hide")
    nftScoreElement.classList.add("hide")
}

function onKeyPress(event){
    if (event.key === "ArrowLeft"){
        moveLeft()
    } else if(event.key === "ArrowRight"){
        moveRight()
    } else if (event.key === "ArrowUp"){
        stopMoving()
    }
}

startGame()