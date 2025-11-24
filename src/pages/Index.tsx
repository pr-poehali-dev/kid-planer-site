import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  deadline?: string;
  type: 'schedule' | 'homework';
}

interface Note {
  id: number;
  text: string;
  author: 'child' | 'parent';
  timestamp: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Сделать математику', completed: false, deadline: '2025-11-25', type: 'homework' },
    { id: 2, title: 'Прочитать 10 страниц', completed: false, deadline: '2025-11-24', type: 'homework' },
    { id: 3, title: 'Убрать в комнате', completed: false, type: 'schedule' },
    { id: 4, title: 'Покормить кота', completed: true, type: 'schedule' },
  ]);

  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: 'Не забудь про тренировку в субботу!', author: 'parent', timestamp: '10:30' },
    { id: 2, text: 'Мама, купи новые фломастеры, пожалуйста', author: 'child', timestamp: '14:20' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [newNote, setNewNote] = useState('');
  const [completedCount, setCompletedCount] = useState(1);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          setCompletedCount(prev => prev + 1);
          toast.success('Отлично! Задание выполнено! 🎉', {
            description: `Ты молодец! Уже ${completedCount + 1} дел сделано!`,
          });
        } else {
          setCompletedCount(prev => Math.max(0, prev - 1));
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const addTask = (type: 'schedule' | 'homework') => {
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
      type,
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    toast.success('Новое дело добавлено!');
  };

  const addNote = (author: 'child' | 'parent') => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now(),
      text: newNote,
      author,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setNotes([...notes, note]);
    setNewNote('');
    toast.success('Заметка отправлена! 📝');
  };

  const getUrgentTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => !task.completed && task.deadline === today);
  };

  const urgentTasks = getUrgentTasks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="text-center space-y-4 animate-slide-up">
          <div className="flex items-center justify-center gap-3">
            <div className="text-6xl bounce-in float">🎯</div>
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Мой Планер
            </h1>
            <div className="text-6xl bounce-in float" style={{ animationDelay: '0.2s' }}>✨</div>
          </div>
          <p className="text-lg text-muted-foreground">Управляй своим временем как супергерой!</p>
        </div>

        {urgentTasks.length > 0 && (
          <Card className="border-4 border-red-400 bg-red-50 wiggle shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Icon name="AlertCircle" className="animate-pop" />
                Срочно сегодня!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {urgentTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-white rounded-lg">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <span className="font-medium">{task.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-shadow animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Trophy" size={24} />
                Прогресс дня
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold">{completedCount}/{tasks.length}</div>
              <p className="text-purple-100 mt-2">дел выполнено</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-xl hover:shadow-2xl transition-shadow animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BookOpen" size={24} />
                Домашка
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold">
                {tasks.filter(t => t.type === 'homework' && !t.completed).length}
              </div>
              <p className="text-orange-100 mt-2">осталось заданий</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-shadow animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MessageCircle" size={24} />
                Заметки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold">{notes.length}</div>
              <p className="text-blue-100 mt-2">сообщений</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-white shadow-lg">
            <TabsTrigger value="schedule" className="text-sm md:text-base py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Icon name="Calendar" className="mr-2" size={18} />
              Дела
            </TabsTrigger>
            <TabsTrigger value="homework" className="text-sm md:text-base py-3 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Icon name="BookOpen" className="mr-2" size={18} />
              Домашка
            </TabsTrigger>
            <TabsTrigger value="notes-child" className="text-sm md:text-base py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              <Icon name="Pencil" className="mr-2" size={18} />
              Мои заметки
            </TabsTrigger>
            <TabsTrigger value="notes-parent" className="text-sm md:text-base py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white">
              <Icon name="Heart" className="mr-2" size={18} />
              От родителей
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card className="shadow-xl animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">📅</span>
                  Расписание дел
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Новое дело..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask('schedule')}
                    className="text-lg"
                  />
                  <Button onClick={() => addTask('schedule')} size="lg" className="bg-purple-500 hover:bg-purple-600">
                    <Icon name="Plus" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {tasks.filter(t => t.type === 'schedule').map((task, index) => (
                    <Card 
                      key={task.id} 
                      className={`p-4 transition-all hover:shadow-lg ${task.completed ? 'bg-green-50 border-green-300' : 'bg-white hover:scale-102'}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="scale-125"
                        />
                        <span className={`flex-1 text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </span>
                        {task.completed && <span className="text-2xl animate-pop">✅</span>}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homework" className="space-y-4">
            <Card className="shadow-xl animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">📚</span>
                  Домашние задания
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Новое задание..."
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTask('homework')}
                    className="text-lg"
                  />
                  <Button onClick={() => addTask('homework')} size="lg" className="bg-yellow-500 hover:bg-yellow-600">
                    <Icon name="Plus" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {tasks.filter(t => t.type === 'homework').map((task, index) => (
                    <Card 
                      key={task.id} 
                      className={`p-4 transition-all hover:shadow-lg ${task.completed ? 'bg-green-50 border-green-300' : 'bg-white hover:scale-102'}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.id)}
                          className="scale-125"
                        />
                        <div className="flex-1">
                          <span className={`text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </span>
                          {task.deadline && (
                            <div className="flex items-center gap-1 mt-1">
                              <Icon name="Clock" size={14} />
                              <span className="text-sm text-muted-foreground">
                                {new Date(task.deadline).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          )}
                        </div>
                        {task.completed && <span className="text-2xl animate-pop">✅</span>}
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes-child" className="space-y-4">
            <Card className="shadow-xl animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">✍️</span>
                  Мои заметки для родителей
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Что хочешь сказать родителям?"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="font-handwriting text-xl min-h-[100px]"
                  />
                  <Button onClick={() => addNote('child')} size="lg" className="bg-blue-500 hover:bg-blue-600 self-end">
                    <Icon name="Send" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {notes.filter(n => n.author === 'child').map((note, index) => (
                    <Card 
                      key={note.id} 
                      className="p-4 bg-blue-50 border-blue-200 hover:shadow-lg transition-all"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">👦</div>
                        <div className="flex-1">
                          <p className="font-handwriting text-xl text-foreground">{note.text}</p>
                          <p className="text-sm text-muted-foreground mt-2">{note.timestamp}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes-parent" className="space-y-4">
            <Card className="shadow-xl animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">💌</span>
                  Сообщения от родителей
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Сообщение для ребенка..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="text-lg min-h-[100px]"
                  />
                  <Button onClick={() => addNote('parent')} size="lg" className="bg-green-500 hover:bg-green-600 self-end">
                    <Icon name="Send" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {notes.filter(n => n.author === 'parent').map((note, index) => (
                    <Card 
                      key={note.id} 
                      className="p-4 bg-green-50 border-green-200 hover:shadow-lg transition-all"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">👨‍👩‍👧</div>
                        <div className="flex-1">
                          <p className="text-lg text-foreground">{note.text}</p>
                          <p className="text-sm text-muted-foreground mt-2">{note.timestamp}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-purple-300 shadow-xl animate-fade-in">
          <CardContent className="p-6 text-center">
            <p className="text-2xl font-bold text-purple-700 mb-2">
              🌟 Ты отлично справляешься! Продолжай в том же духе! 🌟
            </p>
            <p className="text-muted-foreground">Каждое выполненное дело приближает тебя к успеху!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
