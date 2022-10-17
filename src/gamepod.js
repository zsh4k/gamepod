class Gamepod {
	/**
	 * @param {number} responseTime Min 1 max 500
	 */
	constructor(responseTime = 50) {
		//states
		this._stateOnJoystickMove = [];
		this._stateOnPress = [];
		this._stateOnTrigger = [];
		this._stateOnAction = [];

		//config
		this._intervalId = undefined;
		this.gamepads = [];
		this.gamepad = undefined;

		//Events
		this._onJoystickMove = undefined;
		this._onPress = undefined;
		this._onTrigger = undefined;
		this._onAction = undefined;

		//gamelopp
		this._gameloop = () => {
			this.gamepads = navigator
				.getGamepads()
				.filter((gamepad) => gamepad !== null);
			this.gamepad = this.gamepads[this.gamepads.length - 1];

			if (this._onTrigger) this._onTrigger();
			if (this._onAction) this._onAction();
			if (this._onPress) this._onPress();
			if (this._onJoystickMove) this._onJoystickMove();
		};

		window.addEventListener("gamepadconnected", () => {
			this.gamepads = navigator
				.getGamepads()
				.filter((gamepad) => gamepad !== null);
			this.gamepad = this.gamepads[this.gamepads.length - 1];
			this._intervalId = setInterval(this._gameloop, responseTime);
		});

		window.addEventListener("gamepaddisconnected", (ev) => {
			clearInterval(this._intervalId);
		});
	}

	set gameController(position) {
		this.gamepad = this.gamepads[position];
	}

	get gameControllers() {
		return this.gamepads;
	}

	_filter(array) {
		return array.filter((result) => {
			return (
				Math.abs(result.value) > 0.00001 || Math.abs(result) > 0.00001
			);
		});
	}

	/**
	 * @typedef {Object} onJoystickMoveEvent returned
	 * @property {number} [leftX]
	 * @property {number} [leftY]
	 * @property {number} [rightX]
	 * @property {number} [rightY]
	 */

	/**
	 * @description Run when move the Joysticks
	 * @param {(event: onJoystickMoveEvent)=> void} callback
	 * @returns {{leftX: number, leftY: number, rightX: number, rightY:number}}
	 */
	set onJoystickMove(callback) {
		const def = () => {
			const { axes } = this.gamepad;
			const [leftX, leftY, rightX, rightY] = axes;
			const eventResult = {
				leftX,
				leftY,
				rightX,
				rightY,
			};

			const axesMove = axes.filter((value) => Math.abs(value) >= 0.001);
			if (axesMove.length) callback(eventResult);
		};
		this._onJoystickMove = def;
	}

	/**
	 * @description return the all buttons pressed
	 * @param {(buttons: {
	 * 		pressed: boolean,
	 * 		touched: boolean,
	 * 		value: number
	 *	}[])=>void} callback
	 */
	set onPress(callback) {
		const def = () => {
			const { buttons } = this.gamepad;
			const buttonsPress = this._filter(buttons);
			const { lenght: prevLeght } = this._filter(this._stateOnPress);

			if (buttonsPress.length || prevLeght) {
				callback(buttons);
				this._stateOnPress = buttons;
				console.log("first");
			}
		};
		this._onPress = def;
	}

	/**
	 * @description return the all tiggers
	 * @param {(buttons: {
	 * 		pressed: boolean,
	 * 		touched: boolean,
	 * 		value: number
	 *	}[])=>void} callback
	 */
	set onTrigger(callback) {
		const def = () => {
			const { buttons } = this.gamepad;
			const triggers = buttons.slice(4, 8);
			const { length: pressLenght } = this._filter(triggers);
			const { length: prevLeght } = this._filter(this._stateOnTrigger);

			if (pressLenght || prevLeght) {
				callback(triggers);
				this._stateOnTrigger = triggers;
			}
		};
		this._onPress = def;
	}

	/**
	 * @description return the complete event whit user action
	 * @param {(actions: any[])=>void} callback
	 */
	set onAction(callback) {
		const def = () => {
			const { buttons } = this.gamepad;
			const { axes } = this.gamepad;
			const allElement = [...buttons, ...axes];
			const { lenght: actionsLenght } = this._filter(allElement);
			const { lenght: prevLenght } = this._filter(this._stateOnAction);
			if (actionsLenght || prevLenght) {
				callback(this.gamepad);
				this._stateOnAction = allElement;
			}
		};
		this._onAction = def;
	}
}

const id = document.getElementById("test");
const game = new Gamepod();
game.onTrigger = (data) => {
	id.innerHTML = JSON.stringify({ ...data });
	console.log();
};
