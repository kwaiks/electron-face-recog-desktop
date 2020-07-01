const db = require('../config/dbconnection');
const {status,createResponse} = require('../config/const');

const submitAttendance = async (req,res)=>{
    const name = req.body.name;
    const id = req.body.id;
    const nik = req.body.nik;
    const pic = req.body.pic;

    const scheduleData = await db.query('SELECT starttime,endtime,class,subject,code FROM schedule INNER JOIN subjects ON subjects.id = schedule.subjectid WHERE id = ?',[id],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send(createResponse(status.ERROR));
        }
        return result;
    });

    db.query('INSERT INTO attendance (class,starttime,endtime,subject,code,attendtime,name,nik, picEvidence) VALUES(?,?,?,?,?,NOW(),?,?,?)',[
        scheduleData.class, scheduleData.starttime, scheduleData.endtime, scheduleData.subject, scheduleData.code,name,nik,pic],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send(createResponse(status.ERROR));
        }
        return res.status(200).send(createResponse(status.SUCCESS));
    })
}

const getAllAttendance = async (req,res) => {
    db.query('SELECT attendance.id,nik,name,code,subject,class,starttime,endtime,day,attendtime, status, confirmed, pic_evidence FROM attendance INNER JOIN schedule ON schedule.id = attendance.scheduleid INNER JOIN subjects ON subjects.id = schedule.subjectid', (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send(createResponse(status.ERROR))
        }
        return res.status(200).send(result)
    })
}

const getUserAttendance = async (req,res) => {
    const nik = req.params.nik;
    db.query('SELECT code,subject,class,starttime,endtime,day,attendtime, status, confirmed, pic_evidence FROM attendance INNER JOIN schedule ON schedule.id = attendance.scheduleid INNER JOIN subjects ON subjects.id = schedule.subjectid WHERE attendance.nik =?', [nik], (err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send(createResponse(status.ERROR))
        }
        return res.status(200).send(result)
    })
}

const updateAttendance = async (req,res) => {
    const id = req.body.id;
    const reason = req.body.reason;
    console.log(reason)

    db.query('UPDATE attendance SET confirmed=1, status=? WHERE id = ?',[reason,id],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(400).send(createResponse(status.ERROR))
        }
        return res.status(200).send(createResponse(status.SUCCESS))
    })
}

module.exports ={
    submitAttendance,
    getAllAttendance,
    getUserAttendance,
    updateAttendance
}
