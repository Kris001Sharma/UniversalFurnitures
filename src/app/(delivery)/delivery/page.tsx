import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, AlertCircle, Camera, MessageSquare, Navigation } from 'lucide-react';
import { DeliveryTask } from '../../../types';

const MOCK_DELIVERY_TASKS: DeliveryTask[] = [
  {
    id: 'DT-101',
    orderId: 'ORD-8821',
    orgId: '2',
    orgName: 'Oakwood Academy',
    address: '45 Education Blvd, City Center',
    status: 'In Progress',
    priority: 'High',
    itemsExpected: 50,
    itemsReceived: 50,
    contactName: 'Robert Brown',
    contactPhone: '+1 234 567 892',
    dueDate: '2026-04-07',
    locationTagged: false,
  },
  {
    id: 'DT-102',
    orderId: 'ORD-7712',
    orgId: '1',
    orgName: 'City General Hospital',
    address: '123 Medical Way, Downtown',
    status: 'Open',
    priority: 'Normal',
    itemsExpected: 5,
    contactName: 'Dr. Sarah Smith',
    contactPhone: '+1 234 567 890',
    dueDate: '2026-04-08',
  }
];

export default function DeliveryPage() {
  const [tasks, setTasks] = useState<DeliveryTask[]>(MOCK_DELIVERY_TASKS);
  const [activeTask, setActiveTask] = useState<DeliveryTask | null>(tasks.find(t => t.status === 'In Progress') || null);
  const [receivedInput, setReceivedInput] = useState<string>('');

  const openDeliveries = tasks.filter(t => t.status === 'Open').length;
  const pendingDeliveries = tasks.filter(t => t.status === 'In Progress').length;
  const priorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Delivered').length;

  const handleHandover = () => {
    if (activeTask && receivedInput) {
      setActiveTask({ ...activeTask, itemsReceived: parseInt(receivedInput, 10) });
      setTasks(tasks.map(t => t.id === activeTask.id ? { ...t, itemsReceived: parseInt(receivedInput, 10), status: 'In Progress' } : t));
    }
  };

  const handleTagLocation = () => {
    if (activeTask) {
      setActiveTask({ ...activeTask, locationTagged: true });
      setTasks(tasks.map(t => t.id === activeTask.id ? { ...t, locationTagged: true } : t));
    }
  };

  const handleMarkDelivered = () => {
    if (activeTask) {
      const updatedTask = { ...activeTask, status: 'Delivered' as const };
      setTasks(tasks.map(t => t.id === activeTask.id ? updatedTask : t));
      setActiveTask(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* KPI Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
              <Truck size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{openDeliveries}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Open Tasks</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Navigation size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{pendingDeliveries}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">In Progress</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
              <AlertCircle size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{priorityTasks}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Priority Tasks</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{tasks.filter(t => t.status === 'Delivered').length}</div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Completed Today</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Active Task Monitoring */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Current Delivery Task</h3>
          
          {activeTask ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-start bg-amber-50/30">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-slate-900 text-lg">{activeTask.orderId}</h4>
                    {activeTask.priority === 'High' && (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded uppercase tracking-wider">Priority</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{activeTask.orgName}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    activeTask.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {activeTask.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Step 1: Handover */}
                <div className={`p-4 rounded-2xl border ${activeTask.itemsReceived ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                  <h5 className="font-bold text-slate-900 mb-2">1. Warehouse Handover</h5>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-slate-500 mb-2">Expected Items: <strong className="text-slate-900">{activeTask.itemsExpected}</strong></p>
                      {!activeTask.itemsReceived ? (
                        <div className="flex gap-2">
                          <input 
                            type="number" 
                            placeholder="Items received..." 
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm"
                            value={receivedInput}
                            onChange={(e) => setReceivedInput(e.target.value)}
                          />
                          <button 
                            onClick={handleHandover}
                            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800"
                          >
                            Confirm
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-emerald-700 flex items-center gap-2">
                          <CheckCircle2 size={16} /> Confirmed {activeTask.itemsReceived} items received.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2: Client Details & Navigation */}
                {activeTask.itemsReceived && (
                  <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100">
                    <h5 className="font-bold text-slate-900 mb-4">2. Client Destination</h5>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</p>
                        <p className="text-sm font-medium text-slate-900 mt-1">{activeTask.address}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact</p>
                        <p className="text-sm font-medium text-slate-900 mt-1">{activeTask.contactName}</p>
                        <p className="text-sm text-slate-500">{activeTask.contactPhone}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100">
                        <Navigation size={16} /> Navigate
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-300">
                        <MessageSquare size={16} /> Chat with Admin
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Delivery Confirmation */}
                {activeTask.itemsReceived && (
                  <div className="p-4 rounded-2xl border bg-slate-50 border-slate-100">
                    <h5 className="font-bold text-slate-900 mb-4">3. Delivery Confirmation</h5>
                    <div className="flex flex-wrap gap-3 mb-4">
                      <button 
                        onClick={handleTagLocation}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                          activeTask.locationTagged ? 'bg-emerald-100 text-emerald-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <MapPin size={16} /> {activeTask.locationTagged ? 'Location Tagged' : 'Tag Geolocation'}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Camera size={16} /> Upload Proof
                      </button>
                    </div>
                    <button 
                      onClick={handleMarkDelivered}
                      disabled={!activeTask.locationTagged}
                      className={`w-full py-3 rounded-xl text-sm font-bold transition-colors ${
                        activeTask.locationTagged 
                          ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-100' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Mark as Delivered
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-900">No Active Task</h4>
              <p className="text-sm text-slate-500 mt-2">Select a task from the queue to begin delivery.</p>
            </div>
          )}
        </div>

        {/* Task Queue */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Task Queue</h3>
          <div className="space-y-4">
            {tasks.filter(t => t.status === 'Open').map(task => (
              <div key={task.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-slate-900">{task.orderId}</h5>
                  {task.priority === 'High' && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-4 line-clamp-1">{task.orgName}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{task.itemsExpected} Items</span>
                  <button 
                    onClick={() => {
                      setActiveTask(task);
                      setReceivedInput('');
                    }}
                    disabled={!!activeTask}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Start Task
                  </button>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === 'Open').length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">No open tasks available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
