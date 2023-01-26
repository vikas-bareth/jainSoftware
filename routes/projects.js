const express = require('express');
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Project = require('../models/projects')
const { projectSchema } = require('../schemas.js')
const{isLoggedIn} = require('../middleware');

const router = express.Router();
const validateProject = (req,res,next) => {
	const{error} = projectSchema.validate(req.body);
	if(error){
		const msg = error.details.map(el => el.message).join(',')
		throw new ExpressError(msg,400)
	} else{
		next();
	}

}

router.get('/',isLoggedIn,catchAsync(async (req,res) => {
	const projects = await Project.find({})
	res.render('./projects/index',{projects})
}))

router.get('/new',isLoggedIn,(req,res) => {
	res.render('./projects/new')
})
router.post('/',isLoggedIn, validateProject,catchAsync( async (req,res,next) => {
	const project = new Project(req.body.project)
	await project.save();
	req.flash('success','Successfully made a new Project')
	// res.redirect(`/projects/${project._id}`)
    res.redirect('/projects')
}))


router.get('/:id',catchAsync(async (req,res) => {
	const project = await Project.findById(req.params.id).populate('users');
	console.log(project)
	if (!project) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/projects');
    }
	res.render('./projects/show',{project})
}))


//******************Edit page******************
router.get('/:id/edit',isLoggedIn,catchAsync(async (req,res) => {
	const project = await Project.findById(req.params.id)
	if (!project) {
        req.flash('error', 'Cannot find that project!');
        return res.redirect('/projects');
    }
	res.render('./projects/edit',{project})
}))
	//******************submitting Edit page form******************
router.put('/:id',isLoggedIn,validateProject,catchAsync(async (req,res) => {
	const { id } = req.params;
	const project = await Project.findByIdAndUpdate(id, {...req.body.project})
	req.flash('success', 'Successfully updated project!');
	res.redirect(`/projects/${project._id}`)
}))

//******************Delete Route for specific project******************
router.delete('/:id',isLoggedIn,catchAsync(async (req,res) => {
	const { id } = req.params;
	await Project.findByIdAndDelete(id);
	req.flash('success', 'Successfully deleted project')
	res.redirect('/projects');

}))








module.exports = router;