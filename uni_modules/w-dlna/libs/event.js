let  events = {};
const event = {
  $on: (name, callback) => {
    if (!events[name]) {
      events[name] = []
    }
    events[name].push(callback)
  },
  $removeAll: (name, callback) => {
    events = {}
  },
  $remove: (name, callback) => {
    const index = events?. [name]?.indexOf(callback)
    if (index && index !== -1) {
      events[name].splice(index, 1);
    }
  },
  $emit: (name, args) => {
    events?. [name]?.forEach(callback => {
      callback(args)
    })
  }
};

export default event
