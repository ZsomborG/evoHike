import { useState, type ChangeEvent } from 'react';
import { useRef } from 'react';
import type { Stop } from '../types/newroute';

export const useRouteForm = () => {
  const [tourName, setTourName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [gpxFile, setGpxFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const gpxInputRef = useRef<HTMLInputElement>(null);
  const [stops, setStops] = useState<Stop[]>([
    { id: crypto.randomUUID(), name: '', note: '' },
  ]);

  const triggerGpxInput = () => gpxInputRef.current?.click();
  const handleGpxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setGpxFile(file);
  };

  const clearGpx = () => {
    setGpxFile(null);
    if (gpxInputRef.current) gpxInputRef.current.value = '';
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) setPhoto(file);
  };

  const addStop = () => {
    if (stops.length < 5) {
      setStops([...stops, { id: crypto.randomUUID(), name: '', note: '' }]);
    }
  };

  const removeStop = (id: string) => {
    if (stops.length > 1) {
      setStops(stops.filter((s) => s.id !== id));
    }
  };

  const updateStop = (id: string, field: keyof Stop, value: string) => {
    setStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const submitForm = async () => {
    const formData = new FormData();
    formData.append('tourName', tourName);
    formData.append('description', description);
    formData.append('stops', JSON.stringify(stops));

    if (photo) {
      formData.append('photo', photo);
    }
    if (gpxFile) {
      formData.append('trail', gpxFile);
    }

    console.log(Object.fromEntries(formData));
  };
  return {
    tourName,
    setTourName,
    description,
    setDescription,
    photo,
    setPhoto,
    handleRemovePhoto,
    handleChangeFile,
    gpxFile,
    triggerGpxInput,
    handleGpxChange,
    clearGpx,
    gpxInputRef,
    fileInputRef,
    triggerFileInput,
    stops,
    addStop,
    removeStop,
    updateStop,
    submitForm,
  };
};
