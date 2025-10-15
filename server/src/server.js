const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Business Ideas API is running' });
});

app.get('/api/ideas', (req, res) => {
  try {
    const ideas = db.prepare('SELECT * FROM ideas WHERE is_active = 1 ORDER BY created_at DESC').all();
    
    const ideasWithBulletPoints = ideas.map(idea => ({
      ...idea,
      bulletPoints: idea.bullet_points ? JSON.parse(idea.bullet_points) : [],
      createdAt: idea.created_at,
      updatedAt: idea.updated_at,
      isActive: Boolean(idea.is_active),
      companyName: idea.company_name
    }));
    
    res.json(ideasWithBulletPoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/ideas/:id', (req, res) => {
  try {
    const idea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.id);
    
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    const ideaWithBulletPoints = {
      ...idea,
      bulletPoints: idea.bullet_points ? JSON.parse(idea.bullet_points) : [],
      createdAt: idea.created_at,
      updatedAt: idea.updated_at,
      isActive: Boolean(idea.is_active),
      companyName: idea.company_name
    };
    
    res.json(ideaWithBulletPoints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ideas', (req, res) => {
  try {
    const { summary, description, bulletPoints, status, companyName } = req.body;
    
    const result = db.prepare(`
      INSERT INTO ideas (summary, description, bullet_points, status, company_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      summary,
      description,
      JSON.stringify(bulletPoints || []),
      status || 'draft',
      companyName || null
    );
    
    const newIdea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...newIdea,
      bulletPoints: newIdea.bullet_points ? JSON.parse(newIdea.bullet_points) : [],
      createdAt: newIdea.created_at,
      updatedAt: newIdea.updated_at,
      isActive: Boolean(newIdea.is_active),
      companyName: newIdea.company_name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ideas/:id', (req, res) => {
  try {
    const { summary, description, bulletPoints, status, companyName, isActive } = req.body;
    
    db.prepare(`
      UPDATE ideas 
      SET summary = ?, description = ?, bullet_points = ?, status = ?, 
          company_name = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      summary,
      description,
      JSON.stringify(bulletPoints || []),
      status,
      companyName || null,
      isActive ? 1 : 0,
      req.params.id
    );
    
    const updatedIdea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(req.params.id);
    
    res.json({
      ...updatedIdea,
      bulletPoints: updatedIdea.bullet_points ? JSON.parse(updatedIdea.bullet_points) : [],
      createdAt: updatedIdea.created_at,
      updatedAt: updatedIdea.updated_at,
      isActive: Boolean(updatedIdea.is_active),
      companyName: updatedIdea.company_name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/validations', (req, res) => {
  try {
    const { ideaId, validationData, score } = req.body;
    
    const result = db.prepare(`
      INSERT INTO validations (idea_id, validation_data, score)
      VALUES (?, ?, ?)
    `).run(ideaId, JSON.stringify(validationData), score);
    
    db.prepare(`
      UPDATE ideas SET status = 'validated', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(ideaId);
    
    const validation = db.prepare('SELECT * FROM validations WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...validation,
      validationData: JSON.parse(validation.validation_data)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/business-plans', (req, res) => {
  try {
    const { ideaId, templateId, sections, tasks } = req.body;
    
    const result = db.prepare(`
      INSERT INTO business_plans (idea_id, template_id, sections, tasks)
      VALUES (?, ?, ?, ?)
    `).run(ideaId, templateId, JSON.stringify(sections), JSON.stringify(tasks));
    
    db.prepare(`
      UPDATE ideas SET status = 'planning', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(ideaId);
    
    const businessPlan = db.prepare('SELECT * FROM business_plans WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json({
      ...businessPlan,
      sections: JSON.parse(businessPlan.sections),
      tasks: JSON.parse(businessPlan.tasks)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/implementation-items', (req, res) => {
  try {
    const { ideaId, itemType, name, owner, startDate, endDate, completionPercentage, status } = req.body;
    
    const result = db.prepare(`
      INSERT INTO implementation_items (idea_id, item_type, name, owner, start_date, end_date, completion_percentage, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(ideaId, itemType, name, owner, startDate, endDate, completionPercentage || 0, status || 'not-started');
    
    const item = db.prepare('SELECT * FROM implementation_items WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/implementation-items/:ideaId', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM implementation_items WHERE idea_id = ?').all(req.params.ideaId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, 'localhost', () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   GET    /api/health`);
  console.log(`   GET    /api/ideas`);
  console.log(`   POST   /api/ideas`);
  console.log(`   PUT    /api/ideas/:id`);
  console.log(`   POST   /api/validations`);
  console.log(`   POST   /api/business-plans`);
  console.log(`   POST   /api/implementation-items`);
  console.log(`   GET    /api/implementation-items/:ideaId`);
});
