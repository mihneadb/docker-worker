suite('worker timeouts', function() {
  var co = require('co');
  var testworker = require('../post_task');

  test('worker sleep more than maxRunTime', co(function* () {
    var result = yield testworker({
      payload: {
        image:          'ubuntu',
        command:        [
          '/bin/bash', '-c', 'echo "Hello"; sleep 20; echo "done";'
        ],
        features: {
          liveLog: false
        },
        maxRunTime:         10
      }
    });
    // Get task specific results
    assert.ok(!result.run.success, 'task was not successful');
    assert.ok(result.log.indexOf('Hello') !== -1);
    assert.ok(result.log.indexOf('done') === -1);
    assert.ok(
      result.log.indexOf('[taskcluster] Task timeout') !== -1,
      'Task should contain logs about timeout'
    );
  }));
});
