import update from 'react/lib/update';
import { omit } from 'lodash/object';

const initialState = {
  showRestoreDialog: false,
  displayData: {},
  visibleList: 'current',
  loading: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TASK': {
      const sampleID = action.task.sampleID;

      const displayData = {
        ...state.displayData,
        [sampleID]: {
          ...state.displayData[sampleID],
          tasks: [...state.displayData[sampleID].tasks, { collapsed: false }]
        }
      };

      return Object.assign({}, state, { displayData });
    }
    case 'ADD_TASK_RESULT': {
      const displayData = {
        ...state.displayData,
        [action.sampleID]: {
          ...state.displayData[action.sampleID],
          tasks: [
            ...state.displayData[action.sampleID].tasks.slice(0, action.taskIndex),
            {
              ...state.displayData[action.sampleID].tasks[action.taskIndex],
              progress: action.progress
            },
            ...state.displayData[action.sampleID].tasks.slice(action.taskIndex + 1)
          ]
        }
      };

      return Object.assign({}, state, { displayData });
    }

    case 'ADD_SAMPLES': {
      const samplesData = {};
      action.samplesData.forEach((sample) => {
        samplesData[sample.sampleID] = { collapsed: false, tasks: sample.tasks.map(() => {
          const task = { collapsed: false };
          return task;
        }) };
      });

      return Object.assign({}, state, { displayData: { ...state.displayData, ...samplesData } });
    }

    case 'ADD_SAMPLE': {
      const sampleID = action.sampleData.sampleID;
      const displayData = { ...state.displayData, [sampleID]: { collapsed: false, tasks: [] } };

      // Not creating a copy here since we know that the reference
      // displayData[sampleID] did not exist before
      action.sampleData.tasks.forEach(() => {
        displayData[sampleID].tasks.push({ collapsed: false });
      });

      return Object.assign({}, state, { displayData });
    }
    case 'REMOVE_SAMPLE':
      return Object.assign({}, state, { displayData: omit(state.displayData, action.sampleID) });
    // Removing the task from the queue
    case 'REMOVE_TASK': {
      const displayData = {
        ...state.displayData,
        [action.sampleID]: {
          ...state.displayData[action.sampleID],
          tasks: [...state.displayData[action.sampleID].tasks.slice(0, action.taskIndex),
                  ...state.displayData[action.sampleID].tasks.slice(action.taskIndex + 1)]
        }
      };
      return Object.assign({}, state, { displayData });
    }
    case 'COLLAPSE_SAMPLE': {
      const displayData = Object.assign({}, state.displayData);
      displayData[action.sampleID].collapsed ^= true;

      return { ...state, displayData };
    }
    case 'QUEUE_LOADING': {
      return { ...state, loading: action.loading };
    }
    // Toggle task collapse flag
    case 'COLLAPSE_TASK': {
      const displayData = Object.assign({}, state.displayData);
      displayData[action.sampleID].tasks[action.taskIndex].collapsed ^= true;

      return { ...state, displayData };
    }
    case 'CHANGE_METHOD_ORDER': {
      const displayData = Object.assign({}, state.displayData);

      displayData[action.sampleId].tasks = update(state.displayData[action.sampleId].tasks,
        {
          $splice: [[action.oldIndex, 1],
          [action.newIndex, 0,
          state.displayData[action.sampleId].tasks[action.oldIndex]]]
        });

      return { ...state, displayData };
    }
    case 'CLEAR_ALL':
      {
        return initialState;
      }
    default:
      return state;
  }
};
