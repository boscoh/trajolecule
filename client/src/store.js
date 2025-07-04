import _ from "lodash";
import { inFrames } from "./modules/util";

export default {
  state() {
    return {
      foamId: "",
      tags: {},
      nLoaders: 0,
      loadingMsg: "Connecting...",
      keyboardLock: false,
      datasets: [],
      views: [],
      viewId: "",
      newView: null,
      selectView: null,
      iFrameTrajList: [],
      loadIFrameTrajList: [],
      dumpIFrameTrajList: [],
      minFrame: null,
    };
  },
  getters: {
    isLoading(state) {
      return state.nLoaders > 0;
    },
    frameStr(state) {
      let s;
      s = `Traj: ${state.foamId}`;
      let values = _.map(state.iFrameTrajList, (x) => x[0]);
      if (values.length) {
        s += ` Frame: ${values.join(" ")}`;
      }
      return s;
    },
  },
  mutations: {
    setItem(state, payload) {
      for (let key of _.keys(payload)) {
        state[key] = payload[key];
      }
    },

    addIFrameTraj(state, iFrameTraj) {
      let iFrameTrajList = state.iFrameTrajList;
      iFrameTrajList.push(iFrameTraj);
      state.iFrameTrajList = iFrameTrajList;
    },

    deleteItemFromIFrameTrajList(state, i) {
      state.iFrameTrajList.splice(i, 1);
    },

    addLoad(state, entry) {
      if (!entry.thisFrameOnly) {
        if (inFrames(state.iFrameTrajList, entry.iFrameTraj)) {
          return;
        }
      }
      state.loadIFrameTrajList.push(_.cloneDeep(entry));
    },

    addDumpIFrameTraj(state, iFrameTraj) {
      if (inFrames(state.iFrameTrajList, iFrameTraj)) {
        state.dumpIFrameTrajList.push(iFrameTraj);
        console.log(
          `addDumpIFrameTraj`,
          _.cloneDeep(iFrameTraj),
          "->",
          _.cloneDeep(state.dumpIFrameTrajList),
        );
      }
    },

    toggleIFrameTraj(state, iFrameTraj) {
      if (
        state.iFrameTrajList.length > 1 &&
        inFrames(state.iFrameTrajList, iFrameTraj)
      ) {
        state.dumpIFrameTrajList.push(iFrameTraj);
      } else {
        state.loadIFrameTrajList.push({
          iFrameTraj,
          thisFrameOnly: false,
        });
      }
    },

    pushLoading(state) {
      state.nLoaders += 1;
    },

    popLoading(state) {
      state.nLoaders -= 1;
      if (state.nLoaders <= 0) {
        state.nLoaders = 0;
      }
    },
  },
};
