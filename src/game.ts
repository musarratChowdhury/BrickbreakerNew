import * as Phaser from 'phaser';
import { map_1 } from './Elements/BrickFormations';

var brickBounceSound:any,paddleBounceSound:any;

export default class Demo extends Phaser.Scene {
    ball: any;
    paddle: any;
    //@ts-ignore
    bricks: Phaser.Physics.Arcade.StaticGroup;
    startGame: Boolean = false;
    ballSpeed: number = 400;
    ballMaxSpeed: number = 600;
    ballMinSpeed: number = 300;
    constructor() {
        super('demo');
        Phaser.Scene.call(this, { key: 'breakout' });
        //@ts-ignore
        this.bricks;
        this.paddle;
        this.ball;

    }

    preload() {
        this.load.image('brick_yellow', 'images/bb/yellow.png');
        this.load.image('brick_grey', 'images/bb/grey.png');
        this.load.image('brick_blue', 'images/bb/blue.png');
        this.load.image('brick_orange', 'images/bb/orange.png');
        this.load.image('brick_green', 'images/bb/green.png');
        this.load.image('brick_grey', 'images/bb/grey.png');

        this.load.image('brick_yellow_broken', 'images/bb/yellow_broken.png');
        this.load.image('brick_grey_broken', 'images/bb/grey_broken.png');
        this.load.image('brick_blue_broken', 'images/bb/blue_broken.png');
        this.load.image('brick_orange_broken', 'images/bb/orange_broken.png');
        this.load.image('brick_green_broken', 'images/bb/green_broken.png');
        this.load.image('brick_grey_broken', 'images/bb/grey_broken.png');

        this.load.image('ball', 'images/bb/ball.png');
        this.load.image('paddle', 'images/bb/paddle.png');

        this.load.audio('paddle_bounce','sounds/pingpongboard.ogg')
        this.load.audio('brick_bounce','sounds/ping_pong_8bit_plop.ogg')

    }

    create() {
        this.physics.world.setBoundsCollision(true, true, true, true);
        //Adding user inputs
        this.input.on("pointerdown", () => {
            if (!this.startGame) {
                this.ball.body.enable = true;
                this.ball.setVelocity(this.ballSpeed, -this.ballSpeed);
                this.startGame = true;
            }
        })
        this.input.on('pointermove', (p: PointerEvent) => {
            this.paddle.x = p.x;
        }, this)

        //
        this.bricks = this.physics.add.staticGroup();
        //  var greyBricks = this.physics.add.staticGroup();
         paddleBounceSound = this.sound.add('paddle_bounce');
         brickBounceSound = this.sound.add('brick_bounce')

        var bricksmap1 = map_1;
        bricksmap1.forEach((row, i) => {
            row.forEach((b, j) => {
                if (b == 1) {
                    let brick = this.physics.add.image(this.game.canvas.width / 20 + (j * this.game.canvas.width / row.length), 80 + (i * 34), 'brick_blue');
                    brick.setScale(.128,.2);
                    brick.setOrigin(0.5, 0.5)
                    brick.setBodySize(brick.width, brick.height)
                    brick.setImmovable(true);
                    brick.setBounce(0)
                    brick.body.enable = true;
                    brick.body.x = brick.x - 25;
                    brick.body.y = brick.y - 10;
                    brick.setData('hitcount', 1)
                    brick.setData("color",'blue');

                    this.bricks.add(brick)
                }
                if (b == 2) {
                    let brick = this.physics.add.image(this.game.canvas.width / 20 + (j * this.game.canvas.width / row.length), 80 + (i * 34), 'brick_grey');
                    brick.setScale(0.128,.2);
                    brick.setOrigin(0.5, 0.5)
                    brick.setBodySize(brick.width, brick.height)
                    brick.setImmovable(true);
                    brick.setBounce(0)
                    brick.body.enable = true;
                    brick.body.onCollide = true
                    brick.body.x = brick.x - 25;
                    brick.body.y = brick.y - 10;

                    brick.setData('hitcount', 2)
                    brick.setData("color",'grey');
                    this.bricks.add(brick)
                }
            })
        });

        this.paddle = this.physics.add.sprite(this.game.canvas.width / 2, this.game.canvas.height - 40, 'paddle')
        this.ball = this.physics.add.sprite(40, 40, 'ball');


        this.ball.body.enable = false;
        this.ball.setScale(0.1);
        this.ball.setOrigin(0.5, 0.5)
        this.ball.setBounce(1);
        // this.ball.setVelocity(0, 0);
        this.ball.setCollideWorldBounds(true);



        this.paddle.body.enable = true;

        this.paddle.body.setSize(this.paddle.width, this.paddle.height);
        this.paddle.setImmovable()
        this.paddle.setBounce(0)
        this.paddle.setScale(0.3, 0.17)
        this.paddle.setOrigin(0.5, .5)
        this.paddle.setBodySize(this.paddle.body.width, this.paddle.body.height / 1.2)
        this.paddle.setCollideWorldBounds(true);



        this.physics.add.existing(this.ball);
        this.physics.add.existing(this.paddle);

        this.bricks.getChildren().forEach(b => {
            this.physics.add.collider(b, this.ball, this.hitBrick, undefined, this);
        })

        // this.physics.add.overlap(this.ball,bricks,(ball,brick)=>{
        //         brick.destroy();
        // })


        //  We need to call this because placeOnRectangle has changed the coordinates of all the children
        //  If we don't call it, the static physics bodies won't be updated to reflect them
        // bricks.refresh();
        this.physics.add.collider(this.ball, this.bricks, this.hitBrick, undefined, this);

        this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, undefined, this);

        console.log(this.bricks);




    }
    update(time: number, delta: number): void {
        if (!this.startGame)
            this.ball.setPosition(this.paddle.x, this.paddle.y - this.ball.height * 0.15)

    }
    hitBrick(ball: Phaser.GameObjects.GameObject, brick: Phaser.GameObjects.GameObject) {
        console.log("brick hit");
        brickBounceSound.play();
        
        if (ball.getData('hitcount') == 0) {
            ball.destroy();
        }else if(ball.getData('hitcount')==1){
            if(ball.getData("color")=="blue")
            ball.body.gameObject.setTexture('brick_blue_broken')
            else if(ball.getData("color")=="grey")
            ball.body.gameObject.setTexture('brick_grey_broken')

        }
        ball.setData('hitcount', ball.getData('hitcount') - 1);
    }
    hitPaddle = (ball: any, paddle: any) => {
        
        paddleBounceSound.play();
        var resultantVelo = Math.sqrt(Math.pow(ball.body.velocity.x, 2) + Math.pow(ball.body.velocity.y, 2))
        // console.log(resultantVelo);




        var paddleMidPoint = paddle.body.x + paddle.body.width / 2;
        var ballMidPoint = ball.body.x + ball.body.width / 2;
        var hitDistanceFromMidPoint = Math.abs(ballMidPoint - paddle.body.x);
        // console.log("hit distance from paddel mid,", hitDistanceFromMidPoint);
        var mappedAngle = mapAngleOFIncidence(hitDistanceFromMidPoint, 0, paddle.body.width, 15, 165)
        console.log("incident angle : ", mappedAngle);

        // let rightSideReflectionANgle = 155 * (Math.PI / 180);
        // let lefttSideReflectionAngle = 20 * (Math.PI / 180);
        let angleOfIncident = mappedAngle * (Math.PI / 180);


        if (ballMidPoint >= paddleMidPoint) {
            // debugger
            //if ball hits on the right side of the paddle
            ball.body.velocity.x = resultantVelo * Math.cos(angleOfIncident) * -1
            ball.body.velocity.y = resultantVelo * Math.sin(angleOfIncident) * -1;
            if (mappedAngle < 90) {
                //if ball direction  :  right --> left

                ball.body.velocity.x *= -1

            }
        } else {
            //if ball hits on the left side of the paddle
            ball.body.velocity.x = resultantVelo * Math.cos(angleOfIncident) * -1
            ball.body.velocity.y = resultantVelo * Math.sin(angleOfIncident) * -1;
            // debugger;
            if (mappedAngle >= 90) {
                //if ball direction  :  left --> right
                ball.body.velocity.x *= -1
            }

        }

        var reflectedAngle = Math.atan2(Math.abs(ball.body.velocity.y), ball.body.velocity.x,) * (180 / Math.PI);

        console.log("reflected angle", reflectedAngle);


        // console.log(ball.body.velocity);
    }


}

function mapAngleOFIncidence(value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number): number {
    return (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin;
}


