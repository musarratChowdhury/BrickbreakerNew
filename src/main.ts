import Phaser from 'phaser'
import Demo from './game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 600,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			debug:true
		},
	},
	scene: [Demo],
}

export default new Phaser.Game(config)
