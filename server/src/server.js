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

const transformIdea = (idea) => ({
  id: idea.id,
  summary: idea.summary,
  description: idea.description,
  bulletPoints: idea.bullet_points ? JSON.parse(idea.bullet_points) : [],
  status: idea.status,
  companyName: idea.company_name,
  createdAt: idea.created_at,
  updatedAt: idea.updated_at,
  isActive: Boolean(idea.is_active)
});

app.get('/api/ideas', (req, res) => {
  try {
    const ideas = db.prepare('SELECT * FROM ideas WHERE is_active = 1 ORDER BY created_at DESC').all();
    res.json(ideas.map(transformIdea));
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
    
    res.json(transformIdea(idea));
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
    res.status(201).json(transformIdea(newIdea));
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
    res.json(transformIdea(updatedIdea));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/ideas/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM ideas WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const transformValidation = (validation) => ({
  id: validation.id,
  ideaId: validation.idea_id,
  validationData: validation.validation_data ? JSON.parse(validation.validation_data) : {},
  score: validation.score,
  createdAt: validation.created_at
});

app.get('/api/validations/:ideaId', (req, res) => {
  try {
    const validation = db.prepare('SELECT * FROM validations WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1').get(req.params.ideaId);
    
    if (!validation) {
      return res.status(404).json({ error: 'Validation not found' });
    }
    
    res.json(transformValidation(validation));
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
    res.status(201).json(transformValidation(validation));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/validations/:id', (req, res) => {
  try {
    const { validationData, score } = req.body;
    
    db.prepare(`
      UPDATE validations 
      SET validation_data = ?, score = ?
      WHERE id = ?
    `).run(JSON.stringify(validationData), score, req.params.id);
    
    const validation = db.prepare('SELECT * FROM validations WHERE id = ?').get(req.params.id);
    
    if (!validation) {
      return res.status(404).json({ error: 'Validation not found' });
    }
    
    res.json(transformValidation(validation));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/validations/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM validations WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Validation not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const transformBusinessPlan = (plan) => ({
  id: plan.id,
  ideaId: plan.idea_id,
  templateId: plan.template_id,
  sections: plan.sections ? JSON.parse(plan.sections) : {},
  tasks: plan.tasks ? JSON.parse(plan.tasks) : [],
  createdAt: plan.created_at,
  updatedAt: plan.updated_at
});

app.get('/api/business-plans/:ideaId', (req, res) => {
  try {
    const plan = db.prepare('SELECT * FROM business_plans WHERE idea_id = ? ORDER BY created_at DESC LIMIT 1').get(req.params.ideaId);
    
    if (!plan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }
    
    res.json(transformBusinessPlan(plan));
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
    res.status(201).json(transformBusinessPlan(businessPlan));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/business-plans/:id', (req, res) => {
  try {
    const { templateId, sections, tasks } = req.body;
    
    db.prepare(`
      UPDATE business_plans 
      SET template_id = ?, sections = ?, tasks = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(templateId, JSON.stringify(sections), JSON.stringify(tasks), req.params.id);
    
    const plan = db.prepare('SELECT * FROM business_plans WHERE id = ?').get(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Business plan not found' });
    }
    
    res.json(transformBusinessPlan(plan));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/business-plans/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM business_plans WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Business plan not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const transformImplementationItem = (item) => ({
  id: item.id,
  ideaId: item.idea_id,
  itemType: item.item_type,
  name: item.name,
  owner: item.owner,
  startDate: item.start_date,
  endDate: item.end_date,
  completionPercentage: item.completion_percentage,
  status: item.status,
  createdAt: item.created_at,
  updatedAt: item.updated_at
});

app.get('/api/implementation-items/:ideaId', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM implementation_items WHERE idea_id = ?').all(req.params.ideaId);
    res.json(items.map(transformImplementationItem));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/implementation-item/:id', (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM implementation_items WHERE id = ?').get(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Implementation item not found' });
    }
    
    res.json(transformImplementationItem(item));
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
    res.status(201).json(transformImplementationItem(item));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/implementation-item/:id', (req, res) => {
  try {
    const { itemType, name, owner, startDate, endDate, completionPercentage, status } = req.body;
    
    db.prepare(`
      UPDATE implementation_items 
      SET item_type = ?, name = ?, owner = ?, start_date = ?, end_date = ?, 
          completion_percentage = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(itemType, name, owner, startDate, endDate, completionPercentage, status, req.params.id);
    
    const item = db.prepare('SELECT * FROM implementation_items WHERE id = ?').get(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Implementation item not found' });
    }
    
    res.json(transformImplementationItem(item));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/implementation-item/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM implementation_items WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Implementation item not found' });
    }
    
    res.status(204).send();
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
