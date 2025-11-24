import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  category: 'tasks' | 'homework' | 'streak';
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
  const [stars, setStars] = useState(10);
  const [level, setLevel] = useState(1);
  const [showReward, setShowReward] = useState(false);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_task', title: 'Первый шаг', description: 'Выполни первое дело', icon: '🌟', unlocked: true, requirement: 1, category: 'tasks' },
    { id: 'five_tasks', title: 'Работяга', description: 'Выполни 5 дел', icon: '💪', unlocked: false, requirement: 5, category: 'tasks' },
    { id: 'ten_tasks', title: 'Супергерой', description: 'Выполни 10 дел', icon: '🦸', unlocked: false, requirement: 10, category: 'tasks' },
    { id: 'homework_master', title: 'Отличник', description: 'Выполни 5 домашних заданий', icon: '📚', unlocked: false, requirement: 5, category: 'homework' },
    { id: 'streak_3', title: 'На волне', description: 'Выполняй дела 3 дня подряд', icon: '🔥', unlocked: false, requirement: 3, category: 'streak' },
    { id: 'streak_7', title: 'Не остановить', description: 'Выполняй дела 7 дней подряд', icon: '⚡', unlocked: false, requirement: 7, category: 'streak' },
  ]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const completedHomework = tasks.filter(t => t.completed && t.type === 'homework').length;

  useEffect(() => {
    const newLevel = Math.floor(stars / 10) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      toast.success(`🎊 Поздравляю! Ты достиг ${newLevel} уровня!`, {
        description: `Ты настоящая звезда! Продолжай в том же духе!`,
        duration: 5000,
      });
    }
  }, [stars, level]);

  useEffect(() => {
    checkAchievements();
  }, [completedTasks, completedHomework]);

  const checkAchievements = () => {
    setAchievements(prevAchievements => 
      prevAchievements.map(achievement => {
        if (achievement.unlocked) return achievement;
        
        let shouldUnlock = false;
        
        if (achievement.category === 'tasks' && completedTasks >= achievement.requirement) {
          shouldUnlock = true;
        } else if (achievement.category === 'homework' && completedHomework >= achievement.requirement) {
          shouldUnlock = true;
        }
        
        if (shouldUnlock) {
          toast.success(`🏆 Новое достижение: ${achievement.title}!`, {
            description: achievement.description,
            duration: 5000,
          });
          setStars(prev => prev + 5);
          return { ...achievement, unlocked: true };
        }
        
        return achievement;
      })
    );
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          const earnedStars = task.type === 'homework' ? 3 : 2;
          setStars(prev => prev + earnedStars);
          setShowReward(true);
          setTimeout(() => setShowReward(false), 2000);
          
          toast.success('Отлично! Задание выполнено! 🎉', {
            description: `Ты заработал ${earnedStars} ${earnedStars === 2 ? 'звезды' : 'звезды'}! ⭐`,
          });
        } else {
          const lostStars = task.type === 'homework' ? 3 : 2;
          setStars(prev => Math.max(0, prev - lostStars));
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
  const progressToNextLevel = (stars % 10) * 10;

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

        {showReward && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-9xl animate-pop">⭐</div>
          </div>
        )}

        <Card className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 text-white shadow-2xl border-4 border-yellow-500 animate-scale-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2 flex items-center justify-center gap-2">
                  <span className="animate-pop">⭐</span>
                  <span>{stars}</span>
                </div>
                <p className="text-white/90 font-medium">Звезд собрано</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold mb-2 flex items-center justify-center gap-2">
                  <span className="animate-pop" style={{ animationDelay: '0.1s' }}>🏆</span>
                  <span>{level}</span>
                </div>
                <p className="text-white/90 font-medium">Уровень</p>
                <Progress value={progressToNextLevel} className="mt-2 h-3 bg-white/30" />
                <p className="text-sm text-white/80 mt-1">{10 - (stars % 10)} звезд до {level + 1} уровня</p>
              </div>
              
              <div className="text-center">
                <div className="text-6xl font-bold mb-2 flex items-center justify-center gap-2">
                  <span className="animate-pop" style={{ animationDelay: '0.2s' }}>🎖️</span>
                  <span>{achievements.filter(a => a.unlocked).length}</span>
                </div>
                <p className="text-white/90 font-medium">Достижений</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <div className="text-5xl font-bold">{completedTasks}/{tasks.length}</div>
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
          <TabsList className="grid w-full grid-cols-5 h-auto p-2 bg-white shadow-lg">
            <TabsTrigger value="schedule" className="text-sm md:text-base py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Icon name="Calendar" className="mr-2" size={18} />
              Дела
            </TabsTrigger>
            <TabsTrigger value="homework" className="text-sm md:text-base py-3 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
              <Icon name="BookOpen" className="mr-2" size={18} />
              Домашка
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-sm md:text-base py-3 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Icon name="Award" className="mr-2" size={18} />
              Награды
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
                  <Badge className="ml-auto bg-purple-500">+2 ⭐ за дело</Badge>
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
                  <Badge className="ml-auto bg-yellow-500">+3 ⭐ за задание</Badge>
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

          <TabsContent value="achievements" className="space-y-4">
            <Card className="shadow-xl animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="text-3xl">🏆</span>
                  Коллекция достижений
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <Card 
                      key={achievement.id}
                      className={`p-4 transition-all hover:shadow-lg ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400' 
                          : 'bg-gray-50 opacity-60'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`text-5xl ${achievement.unlocked ? 'animate-pop' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <Badge className="bg-green-500">Получено! ✓</Badge>
                          ) : (
                            <div className="space-y-1">
                              <Progress 
                                value={
                                  achievement.category === 'tasks' 
                                    ? (completedTasks / achievement.requirement) * 100
                                    : achievement.category === 'homework'
                                    ? (completedHomework / achievement.requirement) * 100
                                    : 0
                                } 
                                className="h-2"
                              />
                              <p className="text-xs text-muted-foreground">
                                {achievement.category === 'tasks' && `${completedTasks}/${achievement.requirement}`}
                                {achievement.category === 'homework' && `${completedHomework}/${achievement.requirement}`}
                                {achievement.category === 'streak' && `0/${achievement.requirement} дней`}
                              </p>
                            </div>
                          )}
                        </div>
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
