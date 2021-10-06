 const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

var def = "5fc0b51870a9242166298252";
var undef;

chai.use(chaiHttp);
 
suite('Functional Tests', function(){

 test('Every field filled in', (done)=>{
chai
.request(server)
.post("/api/issues/apitest")
.set("content-type", "application/json")
.send({
     issue_title: 'Issue Title 2',
      issue_text: 'Functional Test - Every field filled in',
      created_by: 'RM',
      assigned_to: 'Replit'   
   })
   .end((err, res)=>{
    assert.equal(res.status, 200); 
    assert.equal(res.type, 'application/json');  assert.equal(res.body.issue_title, "Issue Title 2");
          assert.equal(res.body.assigned_to, "Replit");
          assert.equal(res.body.created_by, 'RM');
          assert.equal(res.body.issue_text, "Functional Test - Every field filled in");
        assert.isObject(res.body);
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.property(res.body, 'open');
        assert.property(res.body, '_id');
        assert.isNotEmpty(res.body._id);
        assert.property(res.body, 'status_text');
        assert.isEmpty(res.body.status_text); 
        undef = res.body._id;
        
    (err)?done(err):done();
   })

 }) //test for every fields ends


 test('Required fields filled in', (done)=>{
   chai
   .request(server)
   .post('/api/issues/apitest')
   .set('content-type', 'application/json')
   .send({
     issue_title: 'Issue Title 1',issue_text: 'Functional Test - Required field filled in',
      created_by: 'RM'
      })
   .end((err, res)=>{
    assert.equal(res.status, 200);
    assert.equal(res.type, 'application/json');
    assert.isObject(res.body); 

    (err)?done(err):done();
   })

 })//test for required ends

test('With missing required fields', (done)=>{
chai
.request(server)
.post('/api/issues/apitest')
.set('content-type', 'application/json')
.send({
  created_by: 'fCC'
  })
.end((err, res)=>{
assert.equal(res.status, 200);
assert.equal(res.type, 'application/json');
assert.isObject(res.body);
assert.property(res.body, 'error')
assert.equal(res.body.error, 'required field(s) missing');
done()
})
})// missing required test ends

test('Get an array of all issues', (done)=>{
  chai
  .request(server)
  .get('/api/issues/apitest?')
  .set('content-type', 'application/json')
  .query({})
  .end((err, res)=>{
    assert.equal(res.status, 200);
    assert.equal(res.type, 'application/json');
    assert.isArray(res.body);
    assert.property(res.body[0], '_id');
    assert.property(res.body[0], "issue_title");
    assert.property(res.body[0], "issue_text");
    assert.property(res.body[0], "created_on");
    assert.property(res.body[0], "updated_on");
    assert.property(res.body[0], "created_by");
    assert.property(res.body[0], "assigned_to");
    assert.property(res.body[0], "open");
    assert.property(res.body[0], "status_text");
done()
  })
})//get array with everything ends

test('Get an array with one filter', (done)=>{
  chai
  .request(server)
  .get('/api/issues/apitest?open=false')
  .set('content-type', 'application/json') 
  .query({open: false})
  .end((err, res)=>{
assert.equal(res.status, 200);
assert.equal(res.type, 'application/json');
assert.isArray(res.body); 

res.body.forEach((i)=>{
  assert.property(i, 'open')
  assert.match(i.open, false)
}) 
    done();
  })
})//get array with 1 filter ends


test('Array with multiple filters', (done)=>{
  chai
  .request(server)
  .get('/api/issues/apitest?open=true&assigned_to=Joe')
  .set('content-type', 'application/json')
  .query({
    open: true,assigned_to: 'Joe'
    })
.end((err, res)=>{
assert.equal(res.status, 200);
assert.equal(res.type, 'application/json');
assert.isArray(res.body, 'gets an array of objects');

res.body.forEach((i)=>{
assert.property(i, 'open');
assert.property(i, 'assigned_to'); 
assert.match(i.open, true);
assert.match(i.assigned_to, 'Joe')
})
  done();
})

})//array w/ multiple filters ends


test('Update with missing _id', (done)=>{
chai
.request(server)
.put('/api/issues/apitest')
.set('content-type', 'application/json')
.send({
  issue_text: 'New Issue Text'
})
  .end((err, res)=>{
assert.equal(res.status, 200);
assert.equal(res.type, 'application/json');
assert.isObject(res.body);
assert.property(res.body, 'error');
assert.equal(res.body.error,  'missing _id'
)
    done();
  })
})//update with missing _id ends


test('Update one field', (done)=>{
chai
.request(server)
.put('/api/issues/apitest')
.set('content-type', 'application/json')
.send({
 _id: undef,
 issue_title: 'Issue to be Updated' 
})
.end((err, res)=>{
  assert.equal(res.status, 200);
 assert.equal(res.type, 'application/json'); 
 assert.isObject(res.body)
 assert.deepEqual(res.body, {
   result: 'successfully updated',
      _id: undef
 })

  done();
})

})//update 1 field ends

test('Update multiple fields', (done)=>{
  chai
  .request(server)
  .put('/api/issues/apitest')
  .set('content-type', 'application/json')
  .send({
    _id: undef,
  issue_title: 'Issue to be Updated',
      issue_text: 'Update multiple fields',
      created_by: 'cFF'
  })
  .end((err, res)=>{
assert.equal(res.status, 200);
assert.equal(res.type, 'application/json');
assert.isObject(res.body);
assert.deepEqual(res.body, {
 result: 'successfully updated',
      _id: undef  
});

    done();
  })

})//Update multiple fields ends


test('Update w/ no fields', (done)=>{
chai
.request(server)
.put('/api/issues/apitest')
.set('content-type', 'application/json')
.send({
 _id: def,
 issue_title: 'Issue to be Updated' 
})
.end((err, res)=>{
  assert.equal(res.status, 200);
 assert.equal(res.type, 'application/json'); 
 assert.isObject(res.body)
 assert.deepEqual(res.body, {
   error: 'could not update',
      _id: def
 })

  done();
})

})//update w/ no fields ends


test('Update with an invalid _id', (done)=>{
chai
.request(server)
.put('/api/issues/apitest')
.set('content-type', 'application/json')
.send({})
.end((err, res)=>{
  assert.equal(res.status, 200);
  assert.equal(res.type, 'application/json');
  assert.isObject(res.body);
  assert.property(res.body, 'error');
  assert.equal(res.body.error, 'missing _id');

  done();
})


})//Update w/ invalid _id ends


test('Delete w/ valid _id', (done)=>{
chai
.request(server)
.delete('/api/issues/apitest')
.set('content-type', 'application/json')
.send({_id: undef})
.end((err, res)=>{
assert.equal(res.status, 200);
assert.equal(res.type, 'application/json');
assert.isObject(res.body) 
assert.deepEqual(res.body, {
  _id: undef,
  result: 'successfully deleted'
})
done();
})

})//Delete valid _id ends


test('Delete w/ invalid _id', (done)=>{
chai
.request(server)
.delete('/api/issues/apitest')
.set('content-type', 'application/json')
.send({_id: def})
.end((err, res)=>{
assert.equal(res.status, 200);
assert.equal(res.type, 'application/json');
assert.isObject(res.body) 
assert.deepEqual(res.body, {
  error: 'could not delete',
  _id: def,
})
done();
})

})//Delete invalid _id ends

test('Delete w/ missing _id', (done)=>{
chai.request(server)
.delete('/api/issues/apitest')
.set('content-type', 'application/json')
.send({})
.end((err, res)=>{
assert.equal(res.status, 200)
assert.equal(res.type, 'application/json')
//assert.isObject(res.body)
assert.property(res.body, 'error')
assert.equal(res.body.error, 'missing _id')
  done();
})

})//delete missing _id



}); // end of suite
