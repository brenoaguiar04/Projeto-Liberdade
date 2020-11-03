/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent:jogo,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var keyW,keyA,keyD;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var lives = 3;
var gameOver = false;
var livesText;
var scoreText;
var gameOverText;
var plat2;
var plat3;
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'phaser/assets/sky.png');
    this.load.image('ground', 'phaser/assets/platform.png');
    this.load.image('star', 'phaser/assets/star.png');
    this.load.image('bomb', 'phaser/assets/bomb.png');
    this.load.image('plat2', 'phaser/assets/plat2.png');
    this.load.image('plat3', 'phaser/assets/plat3.png');
    this.load.spritesheet('dude', 'phaser/assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('guy', 'phaser/assets/dude1.png', { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
		
		//atribuição dos códigos das teclas WAD
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();
    plat2 = this.physics.add.staticGroup();
    plat3 = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    plat2.create(400,150, 'plat2');
    plat2.create(100,280, 'plat2');
    plat2.create(700,280, 'plat2');
    plat3.create(200,520, 'plat3');
    plat3.create(300,450, 'plat3');
    plat3.create(400,400, 'plat3');
    plat3.create(500,450, 'plat3');
    plat3.create(600,350, 'plat3');
    plat3.create(230,350, 'plat3');
    plat3.create(240,200, 'plat3');
    plat3.create(550,200, 'plat3');
    plat3.create(600,520, 'plat3');
    plat3.create(400,300, 'plat3');
    //  Now let's create some ledges
    
   

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');
    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
   
    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    ///////////////////////////////////////////////////////////////////////////
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('guy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'guy', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('guy', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'PONTOS: 0', { fontSize: '32px', fill: '#000000' });
    livesText = this.add.text(config.width-200, 16,'❤: '+lives,{ fontSize: '32px', fill: '#FF0000' });
    
     gameOverText = this.add.text(170, config.height*0.5-100,
    'Game Over',{fontFamily:'Arial Black',fontSize: '80px',fontWeight:'bold', 
     fill: 'red'});
    gameOverText.visible = false;
    
    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, plat2);
    this.physics.add.collider(stars, plat2);
    this.physics.add.collider(bombs, plat2);
    this.physics.add.collider(player, plat3);
    this.physics.add.collider(stars, plat3);
    this.physics.add.collider(bombs, plat3);
    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
      
    
    if(lives == 1){
        gameOverText.visible = true;
        player.setTint(0xff0000);
        lives = 0;
        livesText.setText('❤: '+lives);
        player.anims.play('turn');
        //this.game.physics.pause();
       
    }    
    else if(lives>1){
    
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    bomb.x = x;
    bomb.y = 16;
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    player.setTint(0xff0000);

    player.anims.play('turn');
    lives -=1;
    livesText.setText('❤: '+lives);

    setTimeout(function(){ player.clearTint(); }, 3000);
    }
}
function gameOver()
{    
        this.player.visible = false;
        bombs.destroy(true,false);
              
}
