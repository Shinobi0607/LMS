import express from 'express'
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator
} from '../controllers/educatorController.js'
import { protectEducator } from '../middlewares/authMiddleware.js'
import upload from '../configs/multer.js'

const educatorRouter = express.Router()

educatorRouter.get('/update-role', protectEducator, updateRoleToEducator)

educatorRouter.post(
  '/add-course',
  protectEducator,
  upload.single('file'),   // ✅ MATCH frontend
  addCourse
)

educatorRouter.get('/courses', protectEducator, getEducatorCourses)
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)

export default educatorRouter
