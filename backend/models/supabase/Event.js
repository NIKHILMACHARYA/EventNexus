const { supabase } = require('../../config/db');

class Event {
  // Create a new event
  static async create(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Find event by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:users!organizer_id(id, name, email, college)
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Find all events with filters
  static async findAll(filters = {}) {
    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:users!organizer_id(id, name, email, college),
        favorites:favorites(user_id)
      `, { count: 'exact' });

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.eventType) {
      query = query.eq('event_type', filters.eventType);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.college) {
      query = query.ilike('college', `%${filters.college}%`);
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters.upcoming) {
      query = query.gte('date', new Date().toISOString());
    }

    // Sorting
    const sortField = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder === 'desc' ? { ascending: false } : { ascending: true };
    query = query.order(sortField, sortOrder);

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      events: data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Update event
  static async update(id, updateData) {
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete event
  static async delete(id) {
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) throw error;
    return true;
  }

  // Get events by organizer
  static async findByOrganizer(organizerId, filters = {}) {
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('organizer_id', organizerId);

    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    query = query.order('created_at', { ascending: false });

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      events: data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get event categories with counts
  static async getCategories() {
    const { data, error } = await supabase
      .from('events')
      .select('category')
      .eq('status', 'approved');

    if (error) throw error;

    // Count occurrences
    const categoryCounts = data.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCounts).map(([category, count]) => ({
      _id: category,
      count,
    }));
  }

  // Increment view count
  static async incrementViews(id) {
    const { data, error } = await supabase.rpc('increment_event_views', {
      event_id: id,
    });

    if (error) {
      // If RPC doesn't exist, fallback to manual increment
      const event = await this.findById(id);
      if (event) {
        await supabase
          .from('events')
          .update({ views: (event.views || 0) + 1 })
          .eq('id', id);
      }
    }

    return true;
  }

  // Get favorites count for an event
  static async getFavoritesCount(eventId) {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (error) return 0;
    return count;
  }
}

module.exports = Event;
