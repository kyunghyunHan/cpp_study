// App.js - Part 1: 기본 설정 및 상태 관리
import "./global.css";
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  Switch,
  Vibration
} from 'react-native';

// 초기 기본 프리셋 타이머 데이터
const INITIAL_PRESETS = [
  { id: 'ramen', name: '라면', time: 4 * 60, emoji: '🍜', color: 'bg-orange-500', isDefault: true },
  { id: 'pomodoro', name: '포모도로', time: 25 * 60, emoji: '🍅', color: 'bg-red-500', isDefault: true },
  { id: 'exercise', name: '운동', time: 7 * 60, emoji: '💪', color: 'bg-green-500', isDefault: true },
  { id: 'coffee', name: '커피', time: 3 * 60, emoji: '☕', color: 'bg-amber-600', isDefault: true },
  { id: 'meditation', name: '명상', time: 10 * 60, emoji: '🧘', color: 'bg-purple-500', isDefault: true },
  { id: 'rest', name: '휴식', time: 15 * 60, emoji: '😴', color: 'bg-blue-500', isDefault: true },
];

// 색상 옵션들
const COLOR_OPTIONS = [
  { name: '빨강', value: 'bg-red-500', border: 'border-red-500' },
  { name: '주황', value: 'bg-orange-500', border: 'border-orange-500' },
  { name: '노랑', value: 'bg-yellow-500', border: 'border-yellow-500' },
  { name: '초록', value: 'bg-green-500', border: 'border-green-500' },
  { name: '파랑', value: 'bg-blue-500', border: 'border-blue-500' },
  { name: '남색', value: 'bg-indigo-500', border: 'border-indigo-500' },
  { name: '보라', value: 'bg-purple-500', border: 'border-purple-500' },
  { name: '분홍', value: 'bg-pink-500', border: 'border-pink-500' },
  { name: '청록', value: 'bg-teal-500', border: 'border-teal-500' },
  { name: '갈색', value: 'bg-amber-600', border: 'border-amber-600' },
];

// 이모지 옵션들
const EMOJI_OPTIONS = [
  '🍜', '🍅', '💪', '☕', '🧘', '😴', '📚', '🎵', '🎨', '🏃',
  '🧑‍💻', '🎯', '🔥', '⚡', '🌟', '🎪', '🎮', '🎬', '📝', '🧠',
  '🍎', '🥗', '🍵', '🥤', '🍰', '🎂', '🍳', '🥘', '🌮', '🍕'
];

export default function App() {
  // 상태 관리
  const [time, setTime] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [editingPreset, setEditingPreset] = useState(null);
  const [presets, setPresets] = useState(INITIAL_PRESETS);
  const [settings, setSettings] = useState({
    vibration: true,
    soundType: 'default',
    autoStart: false
  });
  const [completedSessions, setCompletedSessions] = useState(0);

  // 새 프리셋 폼 상태
  const [newPreset, setNewPreset] = useState({
    name: '',
    emoji: '⏰',
    color: 'bg-blue-500',
    hours: '',
    minutes: '',
    seconds: ''
  });

  const intervalRef = useRef(null);

  // 타이머 로직
  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (prevTime <= 1) {
            setIsRunning(false);
            const newCount = completedSessions + 1;
            setCompletedSessions(newCount);

            if (settings.vibration) {
              Vibration.vibrate([200, 100, 200, 100, 200]);
            }

            Alert.alert(
              '🎉 타이머 완료!',
              selectedPreset
                ? `${selectedPreset.name} 타이머가 완료되었습니다!`
                : '설정한 시간이 완료되었습니다!',
              [
                { text: '확인', style: 'default' },
                settings.autoStart && selectedPreset ?
                  { text: '다시 시작', onPress: () => startPreset(selectedPreset) } : null
              ].filter(Boolean)
            );

            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, time, settings.vibration, settings.autoStart, selectedPreset, completedSessions]);

  // Part 2에서 함수들 계속...
  // Part 2: 모든 함수들 (Part 1에서 이어짐)

  // 유틸리티 함수들
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (initialTime === 0) return 0;
    return (initialTime - time) / initialTime;
  };

  const startPreset = (preset) => {
    setTime(preset.time);
    setInitialTime(preset.time);
    setSelectedPreset(preset);
    setIsRunning(false);

    if (settings.vibration) {
      Vibration.vibrate(50);
    }
  };

  const startCustomTimer = () => {
    const minutes = parseInt(customMinutes) || 0;
    const seconds = parseInt(customSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;

    if (totalSeconds <= 0) {
      Alert.alert('⚠️ 시간 입력', '올바른 시간을 입력해주세요!');
      return;
    }

    if (totalSeconds > 86400) {
      Alert.alert('⚠️ 시간 제한', '24시간 이하로 설정해주세요!');
      return;
    }

    setTime(totalSeconds);
    setInitialTime(totalSeconds);
    setSelectedPreset(null);
    setIsRunning(false);

    if (settings.vibration) {
      Vibration.vibrate(50);
    }
  };

  // 타이머 제어 함수들
  const handleStartPause = () => {
    if (time <= 0) {
      Alert.alert('⚠️ 시간 설정', '먼저 타이머를 설정해주세요!');
      return;
    }
    setIsRunning(!isRunning);

    if (settings.vibration) {
      Vibration.vibrate(30);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);

    if (settings.vibration) {
      Vibration.vibrate([30, 30]);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setTime(0);
    setInitialTime(0);
    setSelectedPreset(null);

    if (settings.vibration) {
      Vibration.vibrate([30, 30, 30]);
    }
  };

  const handleAddTime = (seconds) => {
    setTime(prev => prev + seconds);
    setInitialTime(prev => prev + seconds);

    if (settings.vibration) {
      Vibration.vibrate(20);
    }
  };

  // 프리셋 관리 함수들
  const openPresetModal = (preset = null) => {
    if (preset) {
      setEditingPreset(preset);
      setNewPreset({
        name: preset.name,
        emoji: preset.emoji,
        color: preset.color,
        hours: Math.floor(preset.time / 3600).toString(),
        minutes: Math.floor((preset.time % 3600) / 60).toString(),
        seconds: (preset.time % 60).toString()
      });
    } else {
      setEditingPreset(null);
      setNewPreset({
        name: '',
        emoji: '⏰',
        color: 'bg-blue-500',
        hours: '',
        minutes: '',
        seconds: ''
      });
    }
    setShowPresetModal(true);
  };

  const savePreset = () => {
    if (!newPreset.name.trim()) {
      Alert.alert('⚠️ 이름 입력', '프리셋 이름을 입력해주세요!');
      return;
    }

    const hours = parseInt(newPreset.hours) || 0;
    const minutes = parseInt(newPreset.minutes) || 0;
    const seconds = parseInt(newPreset.seconds) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) {
      Alert.alert('⚠️ 시간 입력', '올바른 시간을 설정해주세요!');
      return;
    }

    const presetData = {
      id: editingPreset ? editingPreset.id : Date.now().toString(),
      name: newPreset.name.trim(),
      time: totalSeconds,
      emoji: newPreset.emoji,
      color: newPreset.color,
      isDefault: editingPreset ? editingPreset.isDefault : false
    };

    let updatedPresets;
    if (editingPreset) {
      updatedPresets = presets.map(preset =>
        preset.id === editingPreset.id ? presetData : preset
      );
    } else {
      updatedPresets = [...presets, presetData];
    }

    setPresets(updatedPresets);
    setShowPresetModal(false);

    if (settings.vibration) {
      Vibration.vibrate(100);
    }
  };

  const deletePreset = (preset) => {
    Alert.alert(
      '프리셋 삭제',
      `'${preset.name}' 프리셋을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            const updatedPresets = presets.filter(p => p.id !== preset.id);
            setPresets(updatedPresets);

            if (settings.vibration) {
              Vibration.vibrate([50, 50, 50]);
            }
          }
        }
      ]
    );
  };

  const resetToDefaults = () => {
    Alert.alert(
      '기본값으로 초기화',
      '모든 프리셋을 기본값으로 초기화하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '초기화',
          style: 'destructive',
          onPress: () => {
            setPresets(INITIAL_PRESETS);
            Alert.alert('✅ 초기화 완료', '모든 프리셋이 기본값으로 초기화되었습니다.');
          }
        }
      ]
    );
  };

  // Part 3에서 return JSX 계속...
  // Part 3: 완전한 UI 렌더링 (Part 2에서 이어짐)

  // return JSX 시작
  return (
    <View className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800">
      <StatusBar style="light" />

      {/* 헤더 */}
      <View className="pt-14 pb-6 px-5 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">⏰ 타이머 모음</Text>
            <Text className="text-slate-400 text-sm mt-1">완료한 세션: {completedSessions}개</Text>
          </View>
          <TouchableOpacity
            className="bg-slate-700 p-3 rounded-full"
            onPress={() => setShowSettings(true)}
          >
            <Text className="text-white text-lg">⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>

        {/* 타이머 디스플레이 */}
        <View className="items-center my-8">
          <View className="w-64 h-64 rounded-full bg-slate-800/80 border-4 border-slate-700/50 justify-center items-center relative overflow-hidden shadow-2xl">
            {/* 진행률 표시 */}
            <View
              className="absolute w-full h-full rounded-full"
              style={{
                borderWidth: 6,
                borderColor: 'transparent',
                borderTopColor: selectedPreset ?
                  (selectedPreset.color.includes('red') ? '#ef4444' :
                    selectedPreset.color.includes('green') ? '#22c55e' :
                      selectedPreset.color.includes('blue') ? '#3b82f6' :
                        selectedPreset.color.includes('purple') ? '#a855f7' :
                          selectedPreset.color.includes('orange') ? '#f97316' :
                            selectedPreset.color.includes('amber') ? '#f59e0b' :
                              selectedPreset.color.includes('teal') ? '#14b8a6' :
                                selectedPreset.color.includes('indigo') ? '#6366f1' :
                                  selectedPreset.color.includes('yellow') ? '#eab308' :
                                    selectedPreset.color.includes('pink') ? '#ec4899' : '#ef4444')
                  : '#ef4444',
                transform: [{ rotate: `${(getProgress() * 360) - 90}deg` }],
                opacity: getProgress() > 0 ? 1 : 0
              }}
            />

            <View className="items-center z-10 bg-slate-800/40 rounded-full p-8">
              <Text className="text-white text-4xl font-bold font-mono mb-2">
                {formatTime(time)}
              </Text>
              <Text className="text-slate-300 text-sm text-center leading-5">
                {time > 0 ? (isRunning ? '▶️ 실행 중' : '⏸️ 일시정지') : '타이머를 선택하세요'}
              </Text>
              {selectedPreset && (
                <View className="flex-row items-center mt-2">
                  <Text className="text-2xl mr-2">{selectedPreset.emoji}</Text>
                  <Text className="text-slate-300 font-medium">{selectedPreset.name}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 빠른 시간 추가 */}
        {time > 0 && (
          <View className="flex-row justify-center mb-6 space-x-2">
            <TouchableOpacity
              className="bg-slate-700/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
              onPress={() => handleAddTime(30)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-sm">+30초</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-slate-700/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
              onPress={() => handleAddTime(60)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-sm">+1분</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-slate-700/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg"
              onPress={() => handleAddTime(300)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold text-sm">+5분</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 컨트롤 버튼들 */}
        <View className="flex-row justify-between mb-8 px-1">
          <TouchableOpacity
            className={`px-6 py-4 rounded-2xl flex-1 mx-1 shadow-lg ${isRunning ? 'bg-orange-500' : 'bg-green-500'}`}
            onPress={handleStartPause}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-center text-base">
              {isRunning ? '⏸️ 일시정지' : '▶️ 시작'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-slate-700/90 px-6 py-4 rounded-2xl flex-1 mx-1 shadow-lg"
            onPress={handleReset}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-center text-base">🔄 리셋</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-red-500 px-6 py-4 rounded-2xl flex-1 mx-1 shadow-lg"
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-center text-base">⏹️ 정지</Text>
          </TouchableOpacity>
        </View>

        {/* 프리셋 타이머들 */}
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <Text className="text-white text-xl font-bold">🎯 프리셋 타이머</Text>
          <TouchableOpacity
            className="bg-blue-600 px-3 py-2 rounded-lg shadow-lg"
            onPress={() => openPresetModal()}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-sm">+ 추가</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          {presets.map((preset, index) => (
            <View key={preset.id} className="mb-3 relative">
              <TouchableOpacity
                className={`${preset.color}/10 border ${selectedPreset?.id === preset.id ? 'border-white' : `${preset.color.replace('bg-', 'border-')}/20`} p-4 rounded-xl items-center bg-slate-800/50 shadow-lg`}
                onPress={() => startPreset(preset)}
                onLongPress={() => openPresetModal(preset)}
                activeOpacity={0.9}
              >
                <View className="flex-row items-center justify-between w-full">
                  <View className="flex-row items-center flex-1">
                    <View className={`${preset.color}/20 p-3 rounded-full mr-4`}>
                      <Text className="text-3xl">{preset.emoji}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-bold text-lg mb-1">
                        {preset.name}
                      </Text>
                      <Text className="text-slate-300 text-base font-mono mb-1">
                        {formatTime(preset.time)}
                      </Text>
                      <Text className="text-slate-400 text-xs">
                        {preset.isDefault ? '기본 프리셋' : '사용자 정의'}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    {selectedPreset?.id === preset.id && (
                      <View className="bg-green-500 px-2 py-1 rounded-full mb-2">
                        <Text className="text-white text-xs font-semibold">선택됨</Text>
                      </View>
                    )}
                    <Text className="text-slate-500 text-xs">길게 눌러서 수정</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center shadow-lg"
                onPress={() => deletePreset(preset)}
                activeOpacity={0.8}
              >
                <Text className="text-white text-xs font-bold">×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 커스텀 타이머 */}
        <Text className="text-white text-xl font-bold mb-4">⚙️ 빠른 타이머 설정</Text>

        <View className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-slate-700/30 shadow-xl">
          <View className="flex-row items-center justify-center mb-6">
            <View className="items-center mx-2">
              <TextInput
                className="bg-slate-700/90 text-white text-3xl font-bold text-center w-20 h-16 rounded-2xl font-mono border-2 border-slate-600/50"
                placeholder="00"
                placeholderTextColor="#64748b"
                value={customMinutes}
                onChangeText={setCustomMinutes}
                keyboardType="numeric"
                maxLength={3}
              />
              <Text className="text-slate-400 text-sm mt-2 font-semibold">분</Text>
            </View>

            <Text className="text-white text-4xl font-bold mx-4">:</Text>

            <View className="items-center mx-2">
              <TextInput
                className="bg-slate-700/90 text-white text-3xl font-bold text-center w-20 h-16 rounded-2xl font-mono border-2 border-slate-600/50"
                placeholder="00"
                placeholderTextColor="#64748b"
                value={customSeconds}
                onChangeText={setCustomSeconds}
                keyboardType="numeric"
                maxLength={2}
              />
              <Text className="text-slate-400 text-sm mt-2 font-semibold">초</Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-purple-600 py-4 rounded-2xl shadow-lg"
            onPress={startCustomTimer}
            activeOpacity={0.9}
          >
            <Text className="text-white font-bold text-center text-lg">
              ⏱️ 바로 시작하기
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* 프리셋 생성/편집 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPresetModal}
        onRequestClose={() => setShowPresetModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-slate-800 rounded-t-3xl p-6 border-t border-slate-700 max-h-4/5">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">
                {editingPreset ? `${editingPreset.name} 수정` : '새 프리셋 만들기'}
              </Text>
              <TouchableOpacity onPress={() => setShowPresetModal(false)}>
                <Text className="text-slate-400 text-2xl">×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-6">
                <Text className="text-white font-medium mb-2">프리셋 이름</Text>
                <TextInput
                  className="bg-slate-700 text-white p-4 rounded-xl border-2 border-slate-600"
                  placeholder="예: 업무 집중"
                  placeholderTextColor="#64748b"
                  value={newPreset.name}
                  onChangeText={(text) => setNewPreset(prev => ({ ...prev, name: text }))}
                />
              </View>

              <View className="mb-6">
                <Text className="text-white font-medium mb-3">시간 설정</Text>
                <View className="flex-row justify-center items-center space-x-4">
                  <View className="items-center">
                    <TextInput
                      className="bg-slate-700 text-white text-xl font-bold text-center w-16 h-12 rounded-lg font-mono border-2 border-slate-600"
                      placeholder="0"
                      placeholderTextColor="#64748b"
                      value={newPreset.hours}
                      onChangeText={(text) => setNewPreset(prev => ({ ...prev, hours: text }))}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text className="text-slate-400 text-xs mt-1">시간</Text>
                  </View>
                  <Text className="text-white text-2xl">:</Text>
                  <View className="items-center">
                    <TextInput
                      className="bg-slate-700 text-white text-xl font-bold text-center w-16 h-12 rounded-lg font-mono border-2 border-slate-600"
                      placeholder="0"
                      placeholderTextColor="#64748b"
                      value={newPreset.minutes}
                      onChangeText={(text) => setNewPreset(prev => ({ ...prev, minutes: text }))}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text className="text-slate-400 text-xs mt-1">분</Text>
                  </View>
                  <Text className="text-white text-2xl">:</Text>
                  <View className="items-center">
                    <TextInput
                      className="bg-slate-700 text-white text-xl font-bold text-center w-16 h-12 rounded-lg font-mono border-2 border-slate-600"
                      placeholder="0"
                      placeholderTextColor="#64748b"
                      value={newPreset.seconds}
                      onChangeText={(text) => setNewPreset(prev => ({ ...prev, seconds: text }))}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                    <Text className="text-slate-400 text-xs mt-1">초</Text>
                  </View>
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-white font-medium mb-3">이모지 선택</Text>
                <View className="flex-row flex-wrap">
                  {EMOJI_OPTIONS.map((emoji, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`p-3 m-1 rounded-lg ${newPreset.emoji === emoji ? 'bg-blue-600' : 'bg-slate-700'}`}
                      onPress={() => setNewPreset(prev => ({ ...prev, emoji }))}
                    >
                      <Text className="text-2xl">{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="mb-6">
                <Text className="text-white font-medium mb-3">색상 선택</Text>
                <View className="flex-row flex-wrap">
                  {COLOR_OPTIONS.map((colorOption) => (
                    <TouchableOpacity
                      key={colorOption.value}
                      className={`w-12 h-12 rounded-full m-1 ${colorOption.value} ${newPreset.color === colorOption.value ? 'border-4 border-white' : 'border-2 border-slate-600'}`}
                      onPress={() => setNewPreset(prev => ({ ...prev, color: colorOption.value }))}
                    />
                  ))}
                </View>
              </View>

              <View className="flex-row space-x-3 mt-4">
                <TouchableOpacity
                  className="flex-1 bg-slate-600 py-3 rounded-xl"
                  onPress={() => setShowPresetModal(false)}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-center">취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-blue-600 py-3 rounded-xl"
                  onPress={savePreset}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-center">
                    {editingPreset ? '수정' : '저장'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 설정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSettings}
        onRequestClose={() => setShowSettings(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-slate-800 rounded-t-3xl p-6 border-t border-slate-700 max-h-4/5">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-xl font-bold">⚙️ 설정</Text>
              <TouchableOpacity onPress={() => setShowSettings(false)}>
                <Text className="text-slate-400 text-2xl">×</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* 진동 설정 */}
              <View className="bg-slate-700/50 p-4 rounded-xl mb-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg">진동</Text>
                    <Text className="text-slate-300 text-sm mt-1">
                      타이머 완료 시 진동 알림
                    </Text>
                  </View>
                  <Switch
                    value={settings.vibration}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, vibration: value }))}
                    trackColor={{ false: "#374151", true: "#3B82F6" }}
                    thumbColor={settings.vibration ? "#FFFFFF" : "#9CA3AF"}
                  />
                </View>
              </View>

              {/* 자동 시작 설정 */}
              <View className="bg-slate-700/50 p-4 rounded-xl mb-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-white font-semibold text-lg">자동 시작</Text>
                    <Text className="text-slate-300 text-sm mt-1">
                      타이머 완료 후 같은 타이머 자동 시작
                    </Text>
                  </View>
                  <Switch
                    value={settings.autoStart}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, autoStart: value }))}
                    trackColor={{ false: "#374151", true: "#3B82F6" }}
                    thumbColor={settings.autoStart ? "#FFFFFF" : "#9CA3AF"}
                  />
                </View>
              </View>

              {/* 통계 */}
              <View className="bg-slate-700/50 p-4 rounded-xl mb-4">
                <Text className="text-white font-semibold text-lg mb-3">📊 통계</Text>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-slate-300">완료한 세션</Text>
                  <Text className="text-white font-bold text-lg">{completedSessions}개</Text>
                </View>
                <TouchableOpacity
                  className="bg-red-600 py-2 px-4 rounded-lg mt-3"
                  onPress={() => {
                    Alert.alert(
                      '통계 초기화',
                      '모든 통계를 초기화하시겠습니까?',
                      [
                        { text: '취소', style: 'cancel' },
                        {
                          text: '초기화',
                          style: 'destructive',
                          onPress: () => setCompletedSessions(0)
                        }
                      ]
                    );
                  }}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-center text-sm">통계 초기화</Text>
                </TouchableOpacity>
              </View>

              {/* 프리셋 관리 */}
              <View className="bg-slate-700/50 p-4 rounded-xl mb-4">
                <Text className="text-white font-semibold text-lg mb-3">🎯 프리셋 관리</Text>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-slate-300">등록된 프리셋</Text>
                  <Text className="text-white font-bold text-lg">{presets.length}개</Text>
                </View>
                <TouchableOpacity
                  className="bg-orange-600 py-2 px-4 rounded-lg mt-3"
                  onPress={resetToDefaults}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-center text-sm">
                    기본 프리셋으로 초기화
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 앱 정보 */}
              <View className="bg-slate-700/50 p-4 rounded-xl mb-6">
                <Text className="text-white font-semibold text-lg mb-3">ℹ️ 앱 정보</Text>
                <Text className="text-slate-300 text-sm leading-6">
                  타이머 모음 앱 v1.0{'\n'}
                  다양한 프리셋과 커스텀 타이머를 지원합니다.{'\n'}
                  {'\n'}
                  💡 팁: 프리셋을 길게 눌러서 수정할 수 있어요!
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}