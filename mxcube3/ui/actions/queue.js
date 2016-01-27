import fetch from 'isomorphic-fetch'


export function selectSample(queue_id, sample_id, parent_queue_id, method) {
	return { 
		type: "SELECT_SAMPLE", 
		queue_id: queue_id,
		sample_id: sample_id,
		method: method,
		parent_queue_id: parent_queue_id
	}
}

export function toggleCheckBox(queue_id, parent_queue_id = -1) {
	return { 
		type: "TOGGLE_CHECKBOX",
		queue_id: queue_id,
		parent_queue_id: parent_queue_id
	}
}

export function addSample(sample_id, queue_id) {
	return { 
		type: "ADD_SAMPLE", 
		sample_id: sample_id,
		queue_id: queue_id
	}
}

export function removeSample(queue_id) {
	return { 
		type: "REMOVE_SAMPLE", 
		queue_id: queue_id
	}
}

export function clearAll() {
        return {
               type: "CLEAR_QUEUE"
        }
}

export function setQueueState(state) {
        return {
               type: "QUEUE_STATE",
               state: state
        }
}

export function sendRunQueue() {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/start', { 
			method: 'PUT', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to start queue");
			}
		})
		.then(function() {
			dispatch(setQueueState("started"));
		});

	}
}

export function sendPauseQueue() {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/pause', { 
			method: 'PUT', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to pause queue");
			}
		})
		.then(function() {
			dispatch(setQueueState("paused"));
		});

	}
}

export function sendStopQueue() {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/stop', { 
			method: 'PUT', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to stop queue");
			}
		})
		.then(function() {
			dispatch(setQueueState("stopped"));
		});

	}
}

export function sendClearQueue() {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/clear', { 
			method: 'PUT', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to clear queue");
			}
		})
		.then(function() {
			dispatch(clearAll());
		});

	}
}

export function sendAddSample(id) {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue', { 
			method: 'POST', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify({ SampleId : id})
		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to add sample to queue");
			}
			return response.json();
		})
		.then(function(json) {
			dispatch(addSample(json.SampleId, json.QueueId));
		});

	}
}


export function sendDeleteSample(queue_id) {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/' + queue_id, { 
			method: 'DELETE', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			}

		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to remove sample");
			}else {
				dispatch(removeSample(queue_id));
			}
		});

	}
}

export function sendMountSample(queue_id) {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/sample_changer/' + queue_id + "/mount", { 
			method: 'PUT', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			}

		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to mount sample");
			}else {
				dispatch(mountSample(queue_id));
			}
		});

	}
}

export function sendRunSample(queue_id) {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/' + queue_id + "/execute", { 
			method: 'PUT', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			}

		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to mount sample");
			}else {
				dispatch(runSample(queue_id));
			}
		});

	}
}

export function sendToggleCheckBox(queue_id, parent_queue_id = -1) {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/' + queue_id + "/toggle", { 
			method: 'PUT', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			}

		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to toogle sample/method");
			}else {
				dispatch(toggleCheckBox(queue_id, parent_queue_id));
			}
		});

	}
}

export function sendChangeOrder(list) {
	return { 
		type: "CHANGE_SAMPLE_ORDER", 
		list: list
	}
}

export function runSample(queue_id) {
	return { 
		type: "RUN_SAMPLE", 
		queue_id: queue_id
	}
}

export function mountSample(queue_id) {
	return { 
		type: "MOUNT_SAMPLE", 
		queue_id: queue_id
	}
}

export function finishSample(queue_id) {
	return { 
		type: "FINISH_SAMPLE", 
		queue_id: queue_id
	}
}



