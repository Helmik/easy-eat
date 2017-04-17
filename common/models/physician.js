'use strict';

module.exports = function(Physician) {
  Physician.add = function(name, patientName, next) {
    Physician.findOrCreate({name: name}).then(physicians => {
      Physician.app.models.Patient.findOrCreate({name: patientName}).then(patients => {
        var _patient = patients.shift();
        var _physician = physicians.shift();
        Physician.app.models.PhysicianPatient.create({patientId: _patient.id, physicianId: _physician.id, status: 'active'}).then(physicianPatient =>{
          next(null, physicianPatient);
        });
      }).catch(err => {
        console.log(err);
        next(err);
      });

    }).catch(error => {
      console.log("Error", error);
      next(error);
    });
  }
  Physician.getPatients = function(name, next) {
    console.log(Physician.scopes.patients);
    Physician.find({
      include: {
        relation: 'patients',
        scope: {
          fields: ['name'],
          where: {name: 'Gabriel'}
        }
      },
      where: {
        name,
      }
    }).then(patients => {
      console.log(patients);
      next(null, patients);
    }).catch(error => {
      console.log(error);
      next(error);
    });
    /*Physician.findOne({ where: {name: name}}).then(physician => {
      const instance = physician;
      instance.patients({}).then(patients => {
        console.log("Patients");
        patients.map(patient => {
          console.log(patient);
        });
        next(null, patients);
      });
    }).catch(error => {
      console.error(error);
      next(error);
    })*/
  }
  Physician.remoteMethod('add', {
    accepts: [{arg: 'name', type: 'string', required: true},
      {arg: 'patientName', type: 'string', required: true}],
    http: {path: '/add', verb: 'post'},
    returns: {root: true, type: 'object'},
  });
  Physician.remoteMethod('getPatients', {
    accepts: [{arg: 'name', type: 'string', required: true}],
    http: {path: '/getPatients', verb: 'post'},
    returns: {root: true, type: 'object'},
  })
};
