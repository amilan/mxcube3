import fetch from 'isomorphic-fetch'


export function selectSample(parent_queue_id, queue_id, sample_id, method, list_index) {
	return { 
		type: "SELECT_SAMPLE", 
		queue_id: queue_id,
		sample_id: sample_id,
		method: method,
		list_index: list_index,
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

export function removeSample(index) {
	return { 
		type: "REMOVE_SAMPLE", 
		index: index
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


export function sendDeleteSample(id, list_index) {
	return function(dispatch) {

		fetch('mxcube/api/v0.1/queue/' + id, { 
			method: 'DELETE', 
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			}

		}).then(function(response) {
			if (response.status >= 400) {
				throw new Error("Server refused to remove sample");
			}else {
				dispatch(removeSample(list_index));
			}
		});

	}
}