router.get('/settings', isAdmin, async (req, res) => {
  // Fetch all data from DB (about, techstack, projects, awards, socials, etc.)
  // Example:
  // const about = await About.findOne();
  // const techstack = await TechStack.find();
  // const projects = await Project.find();
  // const awards = await Award.find();
  // const socials = await Social.find();
  res.render('admin/settings', {
    // about, techstack, projects, awards, socials
  });
});

router.post('/settings', isAdmin, async (req, res) => {
  // req.body will have all form fields
  // Update About, TechStack, Projects, Awards, Socials as needed
  // Example:
  // await About.updateOne({}, { text: req.body.about });
  // await TechStack.updateMany(...);
  // await Project.updateMany(...);
  // await Award.updateMany(...);
  // await Social.updateMany(...);
  res.redirect('/admin/settings');
});